import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  refreshToken?: string;
  dateJoined?: Date;
  settings?: typeof Schema.Types.ObjectId;
  projectIds?: typeof Schema.Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  username: { // This is now the email, ensuring it's unique
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: { // The added refreshToken field
    type: String,
    default: null
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  settings: {
    type: Schema.Types.ObjectId,
    ref: 'Settings'
  },
  projectIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
});

// Define the virtual for fullName
UserSchema.virtual('fullName').get(function(this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// Before saving, if the password is modified, hash it
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User: Model<IUser> = mongoose.model('User', UserSchema);
