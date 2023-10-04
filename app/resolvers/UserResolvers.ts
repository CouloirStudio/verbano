import { User } from '../models/User';
import { hashPassword } from '../config/passport';

const resolvers = {
  Query: {
    async currentUser(parent: any, args: any, context: any) {
      return context.getUser();
    },
  },

  Mutation: {
    signup: async (
      parent: any,
      { firstName, lastName, email, password }: any,
      context: any,
    ) => {
      try {
        // Check if user exists
        const oldUser = await User.findOne({ email });
        if (oldUser) {
          throw new Error('User already exists');
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create user
        const newUser = new User({
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
        });

        const result = await newUser.save();
        console.log('New User Saved:', result);

        await context.login(result);
        console.log('User Logged In:', result);

        // Return user
        return {
          user: result,
        };
      } catch (error) {
        console.error('Error during user creation:', error);
        throw new Error('Internal server error');
      }
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
  },
};

export default resolvers;
