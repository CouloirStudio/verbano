import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, IUser } from '../app/models/User';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongoose';

/* 
 * Set up passport to use the local strategy.
 * The strategy requires a username and password for authentication.
 */
passport.use(new LocalStrategy(
    {
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username, password, done) => {
        try {
            // Attempt to fetch the user from the database using the provided username
            const user: IUser | null = await User.findOne({ username });
            
            // If user is not found, signify an authentication failure with a message
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            // Check if the provided password matches the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            
            // If password doesn't match, signify an authentication failure with a message
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // If all checks pass, signify authentication success with the user object
            return done(null, user);
        } catch (error) {
            // On any error, pass the error forward
            done(error);
        }
    }
));

/* 
 * Configure how Passport serializes the user.
 * Determines what data from the user object should be stored in the session.
 * In this case, we're storing the user's ID.
 */
passport.serializeUser((user: any, done) => {
    let mongoUser = user as IUser;
    done(null, mongoUser._id.toString());
});

/* 
 * Configure how Passport deserializes the user.
 * Here, the user is fetched from the database using the ID that was serialized to the session.
 */
passport.deserializeUser(async (id: ObjectId, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
