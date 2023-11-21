import { User } from '../../models/User';
import { hashPassword } from '../../config/passport';
import {
  AddUserArgs,
  ResolverContext,
  UpdatePasswordArgs,
  UpdateUserArgs,
} from '@/app/graphql/resolvers/types';
import { Note, Project, Summary } from '@/app/models';
import { ApolloError } from 'apollo-server-express';
import verifyPassword from '@/app/graphql/resolvers/verifyPassword';
import { deleteAudioFromS3 } from '@/app/services/AWSService';
import EmailService from '@/app/services/EmailService';

export const UserQueries = {
  async currentUser(parent: unknown, args: unknown, context: any) {
    return context.getUser();
  },
  async checkCurrentPassword(_: any, { email, password }: any) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      return await verifyPassword(password, user.password);
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while checking the password');
    }
  },
};

export const UserMutations = {
  async signup(_: unknown, args: AddUserArgs, context: any) {
    const password = args.input.password;
    const email = args.input.email;
    const firstName = args.input.firstName;
    const lastName = args.input.lastName;
    if (!password || !email || !firstName || !lastName) {
      throw new Error('All fields are required.');
    }
    // validate input data
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    // validate email
    if (!email.includes('@')) {
      throw new Error('Email has an invalid format.');
    }

    // validate name
    if (!firstName || !lastName) {
      throw new Error('First name and last name are required.');
    }

    // See if user exists
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      throw new Error('An account with this email already exists.');
    }

    // Entered password
    const hashedPassword = await hashPassword(password);

    const activationCode = crypto.randomUUID();

    // Create user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      active: false,
      activationCode: activationCode,
    });

    const result = await newUser.save();

    const activationUrl = `https://localhost:3000/activate/${encodeURIComponent(
      activationCode,
    )}`;
    const emailHtml = `
        <p>Activate your account by clicking the following link:</p>
        <a href="${activationUrl}">Activate Account</a>
        `;

    await EmailService.sendMail(
      newUser.email,
      'Activate Your Account',
      emailHtml,
    );

    // Return user
    return {
      user: result,
    };
  },

  async login(parent: any, { email, password }: any, context: any) {
    const { user } = await context.authenticate('graphql-local', {
      email,
      password,
    });

    if (!user) {
      throw new Error('Incorrect Email or Password');
    }

    if (!user.active) {
      throw new Error(
        'Account not activated. Please check your email for an activation link.',
      );
    }

    await context.login(user);

    return { user };
  },

  async logout(_: any, __: any, { req }: any) {
    return new Promise((resolve, reject) => {
      req.logout((err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  },

  async updateUser(
    _: unknown,
    args: UpdateUserArgs,
    _context: ResolverContext,
  ) {
    if (args.input.email) {
      // check if Google account
      const currentUser = await User.findById(args.id);
      if (!currentUser) {
        throw new Error('user not found');
      }
      if (currentUser.googleId)
        throw new Error('Cannot update Email on google linked account');
      // Make sure they are not changing their email to that of an existing user
      const email = args.input.email;
      const user = await User.findOne({ email });
      if (user) throw new Error('Email in use.');

      const emailTransferCode = crypto.randomUUID();

      currentUser.emailTransfer = {
        code: emailTransferCode,
        oldEmail: currentUser.email,
        newEmail: email,
        requestedAt: new Date(),
      };

      await currentUser.save();

      // Generate a new activation code
      const activationUrl = `https://localhost:3000/transfer/${encodeURIComponent(
        emailTransferCode,
      )}`;

      const emailHtml = `
        <p>Transfer your Verbano account from ${currentUser.email} to ${email} by clicking the following link:</p>
        <a href="${activationUrl}">Confirm Transfer Account</a>
        <p>(If you didn't request this, just ignore it.)</p>
        `;

      await EmailService.sendMail(email, 'Transfer Your Account', emailHtml);

      return !!currentUser;
    }
    const updated = await User.findByIdAndUpdate(args.id, args.input, {
      new: true,
    });
    return !!updated;
  },

  async updateUserPassword(
    _: unknown,
    args: UpdatePasswordArgs,
    _context: ResolverContext,
  ) {
    const id = args.id;
    // get the current user (password and all)
    const user = await User.findById(id);
    if (!user) {
      throw new Error('user not found');
    }

    // check if this is a Google account
    if (user.googleId)
      throw new Error('Cannot update password for Google Linked account.');
    // check if the password is different
    if (await verifyPassword(args.input.newPass, user.password)) {
      throw new Error('New password must be different than old password.');
    }
    // verify the old password
    if (await verifyPassword(args.input.oldPass, user.password)) {
      const password = await hashPassword(args.input.newPass);
      // update
      const updated = await User.findByIdAndUpdate(
        id,
        {
          password: password,
        },
        {
          new: true,
        },
      );
      // check if update was a success
      if (updated) return true;
    } else throw new Error('Old password incorrect.');
  },
  async deleteUserAccount(
    _: unknown,
    args: UpdateUserArgs,
    _context: ResolverContext,
  ) {
    try {
      const email = args.input.email;
      // Perform the logic to delete the user account based on the provided email
      const user = await User.findOneAndDelete({ email });

      if (!user) {
        throw new Error('User not found.');
      }

      // get all projects
      const userProjects = user.projects;

      if (userProjects) {
        // for every project get all notes - first loop
        for (let i = 0; i < userProjects.length; i++) {
          // get project
          const project = await Project.findByIdAndDelete(
            userProjects[i].project,
          );

          if (project) {
            // get project notes
            const notes = project.notes;

            // get project summaries
            const summaries = project.summaries;

            // for every summary delete from mongo
            for (let i = 0; i < summaries.length; i++) {
              await Summary.findByIdAndDelete(summaries[i].summary);
            }

            // for every note delete from mongo and delete from AWS
            for (let i = 0; i < notes.length; i++) {
              const note = await Note.findByIdAndDelete(notes[i].note);
              if (note && note.audioLocation) {
                await deleteAudioFromS3(note.audioLocation);
              }
            }
          }
        }
      } else {
        throw new Error('something went wrong');
      }
      const emailHtml = `
        <p>Just writing to let you know your Verbano account has been deleted.</p>
        <p>We hope to see you again soon!</p>
        <p>(If you didn't request this, just ignore it.)</p>
        `;

      await EmailService.sendMail(email, 'Account Deleted', emailHtml);
      return true; // Return true if the user account was successfully deleted
    } catch (error) {
      console.error(error);
      throw new Error('An error occurred while deleting the user account.');
    }
  },
};

export const UserType = {
  async projects(user: { id: string; projectIds: string[] }) {
    const projects = await Project.find({
      _id: { $in: user.projectIds },
    }).populate('notes.note');

    projects.forEach((project) => {
      project.notes = project.notes.filter((noteRef) => noteRef.note);
    });

    if (!projects || projects.length === 0) {
      throw new ApolloError('No projects found.');
    }

    return projects;
  },
};
