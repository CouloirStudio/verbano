import User from '../models/User';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

module.exports = {
    Query: {
        user: (_: any, {id}: any) => User.findById(id)
    },

    Mutation: {
        async registerUser(_: any, {registerInput: {email, password, firstName, lastName}}: any) {
            console.log("Entered password: " + password);


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


            newUser.token = jwt.sign({userId: newUser._id, email}, "CHANGE_ME_SECRET", {expiresIn: '1h'});

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

            user.token = jwt.sign({userId: user._id, email}, "CHANGE_ME_SECRET", {expiresIn: '1h'});

            return {
                id: user.id,
                ...user.toObject()
            }

        }
    }
}

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