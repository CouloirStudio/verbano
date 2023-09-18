import {User} from '../app/models/User';
import bcrypt from 'bcrypt';
import {ObjectId} from 'mongoose';
import {GraphQLLocalStrategy} from "graphql-passport";
import passport from "passport";
import 'dotenv/config';


const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20');


/*
* Set up passport to use the local strategy.
* The strategy requires a username and password for authentication.
*/
passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
      try {
        const user = await User.findOne({email: email});
        if (!user) {
          throw new Error('Invalid email');
        }
        if (typeof password === "string") {
          const isMatch = await comparePasswords(password, user.password);
          if (!isMatch) {
            throw new Error('Invalid password');
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  scope: ['profile', 'email'],
  state: true
}

const googleCallback = async (accessToken: any, refreshToken: any, profile: any, done: any) => {
  const matchingUser = await User.findOne({googleId: profile.id})
  if (matchingUser) {
    done(null, matchingUser);
    return;
  }
  const id = profile.id;
  const email = profile.emails[0].value;
  const firstName = profile.name.givenName;
  const lastName = profile.name.familyName;
  //create new user
  const newUser = await new User({
    googleId: id,
    firstName: firstName,
    lastName: lastName,
    email: email,
  }).save();
  done(null, newUser);
  done(null, null);
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

export default passport;

