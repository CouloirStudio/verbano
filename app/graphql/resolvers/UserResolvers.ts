import { User } from '../../models/User';
import { hashPassword } from '../../config/passport';
import verifyPassword from './verifyPassword';

export const UserQueries = {
  async currentUser(parent: any, args: any, context: any) {
    return context.getUser();
  },
};

export const UserMutations = {
  async signup(
    parent: any,
    { firstName, lastName, email, password }: any,
    context: any,
  ) {
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
  updateFullName: async (
    _: any,
    {
      email,
      firstName,
      lastName,
    }: { email: string; firstName: string; lastName: string },
  ) => {
    try {
      // Check if a user with the provided email exists
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      // Update the user's firstName and lastName
      user.firstName = firstName;
      user.lastName = lastName;

      // Save the updated user to the database
      // Return the updated user object
      return await user.save();
    } catch (error) {
      // Use a type guard to check if 'error' is an instance of 'Error'
      if (error instanceof Error) {
        throw new Error(`Failed to update full name: ${error.message}`);
      } else {
        // Handle other cases where 'error' is not an instance of 'Error'
        throw new Error('An unknown error occurred');
      }
    }
  },
  updateEmail: async (
    _: any,
    { email, newEmail }: { email: string; newEmail: string },
  ) => {
    try {
      // Find the user with the provided current email
      const user = await User.findOne({ email });

      // If the user does not exist, throw an error
      if (!user) {
        throw new Error('User not found');
      }

      // Update the user's email
      user.email = newEmail;

      // Save the updated user to the database
      await user.save();

      // Return the updated user object
      return user;
    } catch (error) {
      // Handle errors and throw appropriate error messages
      if (error instanceof Error) {
        throw new Error(`Failed to update email: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },
  updatePassword: async (
    _: any,
    {
      password,
      newPassword,
      email,
    }: {
      password: string;
      newPassword: string;
      email: string;
    },
    context: any,
  ) => {
    try {
      // Get the authenticated user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Verify the current password
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash the new password
      // Update the user's password
      user.password = await hashPassword(newPassword);

      // Save the updated user to the database
      await user.save();

      // Return a success message or a boolean indicating success
      return user;
    } catch (error) {
      // Handle errors and throw appropriate error messages
      if (error instanceof Error) {
        throw new Error(`Failed to update password: ${error.message}`);
      } else {
        throw new Error('An unknown error occurred');
      }
    }
  },
};
