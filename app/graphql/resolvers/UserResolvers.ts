import { User } from '../../models/User';
import { hashPassword } from '../../config/passport';
import { ResolverContext, UpdateUserArgs } from '@/app/graphql/resolvers/types';

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

  async updateUser(
    _: unknown,
    args: UpdateUserArgs,
    _context: ResolverContext,
  ) {
    // check if anything is empty
    if (args.input.email.trim() === '') {
      throw new Error('Email Cannot Be Empty');
    }
    const updated = await User.findByIdAndUpdate(args.id, args.input, {
      new: true,
    });
    return !!updated;
  },
};
