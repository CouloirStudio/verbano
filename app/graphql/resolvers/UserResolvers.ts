import { User } from '../../models/User';
import { hashPassword } from '../../config/passport';
import {
  AddUserArgs,
  ResolverContext,
  UpdatePasswordArgs,
  UpdateUserArgs,
} from '@/app/graphql/resolvers/types';
import { Project } from '@/app/models';
import { ApolloError } from 'apollo-server-express';
import verifyPassword from '@/app/graphql/resolvers/verifyPassword';

export const UserQueries = {
  async currentUser(parent: unknown, args: unknown, context: any) {
    return context.getUser();
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

    // Create user
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    const result = await newUser.save();

    await context.login(result);

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
      throw new Error('Invalid credentials');
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
