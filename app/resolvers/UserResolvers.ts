import User from '../models/User';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

module.exports = {
    Query: {
        user: (_: any, {id}: any) => User.findById(id)
    },

    Mutation: {
      async registerUser(_: any, {registerInput: {email, password, firstName, lastName}}: any) {

        // See if user exists
        const oldUser = await User.findOne({email});
        if (oldUser) {
            throw new Error('User already exists');
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName

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

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                throw new Error('Invalid password');
            }

            user.token = jwt.sign({userId: user._id, email}, "CHANGE_ME_SECRET", {expiresIn: '1h'});

            return {
                id: user.id,
                ...user.toObject()
            }

      }
    }
}