import {User} from '../models/User';
import bcrypt from "bcrypt";

const resolvers = {
  Query: {
    async currentUser(parent: any, args: any, context: any) {
      return context.getUser();
    }
  },

  Mutation: {
    signup: async (parent: any, {firstName, lastName, email, password}: any, context: any) => {
      // See if user exists
      const oldUser = await User.findOne({email});
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
        lastName: lastName
      });

      const result = await newUser.save();

      await context.login(result);

      // Return user
      return {
        user: result
      }
    },

    login: async (parent: any, {email, password}: any, context: any) => {
      const {user} = await context.authenticate('graphql-local', {email, password});
      await context.login(user);

      return {user};
    },

    async logout(_: any, __: any, {req}: any) {
      req.logout();
    }
  }
}

export default resolvers;

const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

const comparePasswords = async (enteredPassword: string, storedPasswordHash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(enteredPassword, storedPasswordHash);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};