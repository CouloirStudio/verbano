import {User} from '../models/User';
import {hashPassword} from '../../config/passport';

const resolvers = {
  Query: {
    async currentUser(parent: any, args: any, context: any) {
      return context.getUser()
    },
  },

  Mutation: {
    signup: async (
        parent: any,
        { firstName, lastName, email, password }: any,
        context: any,
    ) => {
      // See if user exists
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        throw new Error('User already exists');
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

    login: async (parent: any, { email, password }: any, context: any) => {
      const { user } = await context.authenticate('graphql-local', {
        email,
        password,
      });
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

    updateFullName: async (_: any, { email, firstName, lastName }: { email: string, firstName: string, lastName: string }) => {
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
  },
};

export default resolvers;
