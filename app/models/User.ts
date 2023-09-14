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

const User = mongoose.model('User', UserSchema);

export default User;