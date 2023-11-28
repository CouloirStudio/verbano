import "dotenv/config";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { ObjectId } from "mongoose";
import { GraphQLLocalStrategy } from "graphql-passport";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

/**
 * Configure how Passport authenticates users.
 * In this case, we're using a local strategy, which means we're using a username and password.
 */
passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new Error('Invalid credentials.');
      }
      if (!user.password) {
        throw new Error(
          'Account created with Google. Please login with Google.',
        );
      }
      if (typeof password === 'string') {
        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
          throw new Error('Invalid credentials.');
        }
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }),
);

const assertEnvVariable = (
  variable: string | undefined,
  name: string,
): string => {
  if (!variable) {
    throw new Error(`Environment variable ${name} is missing`);
  }
  return variable;
};

/**
 * Set up passport to use the Google strategy.
 * The strategy requires a client ID and client secret for authentication.
 */
const googleOptions = {
  clientID: assertEnvVariable(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID'),
  clientSecret: assertEnvVariable(
    process.env.GOOGLE_CLIENT_SECRET,
    'GOOGLE_CLIENT_SECRET',
  ),
  callbackURL: 'https://localhost:3000/auth/google/callback',
  scope: ['profile', 'email'],
  accessType: 'offline',
  state: true,
  passReqToCallback: true as true,
  prompt: 'consent',
};

/**
 * Callback function for Google strategy.
 * @param accessToken the access token
 * @param refreshToken the refresh token which can be used to obtain a new access token
 * @param profile the user's Google profile
 * @param done callback function
 */
const googleCallback = async (
  req: any,
  accessToken: any,
  refreshToken: any,
  profile: any,
  done: any,
) => {
  try {
    let matchingUser = await User.findOne({ googleId: profile.id });
    if (matchingUser) {
      done(null, matchingUser);
      return;
    }

    const id = profile.id;
    const email = profile.emails[0].value;
    let firstName = profile.name.givenName;
    let lastName = profile.name.familyName;

    matchingUser = await User.findOne({ email: email });
    if (matchingUser) {
      done(
        new Error(
          'This email is already in use. Please login with your email and password.',
        ),
        null,
      );
      return;
    }

    // Create new user
    const newUser = await new User({
      googleId: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      refreshToken: refreshToken,
      active: true,
    }).save();

    done(null, newUser);
  } catch (error) {
    done(error, null);
  }
};

passport.use(new GoogleStrategy(googleOptions, googleCallback));

/*
 * Configure how Passport serializes the user.
 * Determines what data from the user object should be stored in the session.
 * In this case, we're storing the user's ID.
 */
passport.serializeUser((user: any, done: any) => {
  done(null, user._id);
});

/*
 * Configure how Passport deserializes the user.
 * Here, the user is fetched from the database using the ID that was serialized to the session.
 */
passport.deserializeUser(async (id: ObjectId, done: any) => {
  const user = await User.findById(id);
  done(null, user);
});

/**
 * A function for hashing passwords.
 * @param password the password to be hashed
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error('Error hashing password');
  }
};

/**
 * Hashes a password using bcrypt.
 * @param enteredPassword the password to hash
 * @param storedPasswordHash the stored password hash
 */
export const comparePasswords = async (
  enteredPassword: string,
  storedPasswordHash: string,
): Promise<boolean> => {
  try {
    return await bcrypt.compare(enteredPassword, storedPasswordHash);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

export default passport;
