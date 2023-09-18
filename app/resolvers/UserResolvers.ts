import {User} from '../models/User';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const resolvers = {
  Query: {
    async currentUser(parent: any, args: any, context: any) {
      return context.getUser();
    }
  },

  Mutation: {
    async registerUser(_: any, {registerInput: {email, password, firstName, lastName}}: any) {


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

      // Save user


      newUser.refreshToken = jwt.sign({userId: newUser._id, email}, "CHANGE_ME_SECRET", {expiresIn: '1h'});

      const result = await newUser.save();

      // Return user
      return {
        id: result.id,
        ...result.toObject()
      }
    },
    async loginUser(_: any, {loginInput: {email, password}}: any) {
      const user = await User.findOne({email});

      if (!user) {
        throw new Error('User does not exist');
      }

      const passwordsMatch = await comparePasswords(password, user.password);

      if (!passwordsMatch) {
        throw new Error('Invalid password:');
      }

      user.refreshToken = jwt.sign({userId: user._id, email}, "CHANGE_ME_SECRET", {expiresIn: '1h'});

      return {
        id: user._id,
        ...user.toObject()
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