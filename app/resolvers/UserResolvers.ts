import {User} from '../models/User';
import {hashPassword} from '../config/passport';

export const UserQueries = {
  async currentUser(parent: any, args: any, context: any) {
    return context.getUser();
  },
};

export const UserMutations = {
  async signup(parent: any, {firstName, lastName, email, password}: any, context: any) {
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
      lastName: lastName,
    });

    const result = await newUser.save();

    await context.login(result);

    // Return user
    return {
      user: result,
    };
  },

  async login(parent: any, {email, password}: any, context: any) {
    const {user} = await context.authenticate('graphql-local', {
      email,
      password,
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    await context.login(user);

    return {user};
  },

  async logout(_: any, __: any, {req}: any) {
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
};
