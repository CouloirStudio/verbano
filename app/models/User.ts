import bcrypt from "bcrypt";
import mongoose, {Schema} from 'mongoose';


// ========== User Model ==========

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    profilePicture: {
        type: String,
        default: null
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    registeredIP: String,
    lastLoginIP: String,
    settings: {
        darkMode: Boolean,
        notifications: Boolean
    },
    projectIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

// A pre-save hook to hash the password before saving
UserSchema.pre('save', function (next) {
    const user = this as any;
    if (!user.isModified('password')) return next();
    bcrypt.hash(user.password, 10, (err: any, hash: any) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = async function (password: string | Buffer) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;