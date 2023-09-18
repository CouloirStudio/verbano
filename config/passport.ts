import {User} from '../app/models/User';
import bcrypt from 'bcrypt';
import {ObjectId} from 'mongoose';
import {GraphQLLocalStrategy} from "graphql-passport";
import passport from "passport";

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

/*
 * Configure how Passport serializes the user.
 * Determines what data from the user object should be stored in the session.
 * In this case, we're storing the user's ID.
 */
passport.serializeUser((user: any, done: any) => {
  console.log("Serializing user: " + user.id)
  done(null, user.id);
});

/*
 * Configure how Passport deserializes the user.
 * Here, the user is fetched from the database using the ID that was serialized to the session.
 */
passport.deserializeUser(async (id: ObjectId, done: any) => {
  console.log("Deserializing user: " + id)
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

