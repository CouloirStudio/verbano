import mongoose, {Document, Model, Schema} from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  refreshToken?: string;
  dateJoined?: Date;
  settings?: typeof Schema.Types.ObjectId;
  projectIds?: typeof Schema.Types.ObjectId[];
  facebookId?: string;
  googleId?: string;
}

const UserSchema = new Schema<IUser>({
  email: { // This is now the email, ensuring it's unique
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
    required: false
  },
  refreshToken: {
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
  }],
  facebookId: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    default: null
  }
});

// Define the virtual for fullName
UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

//compare passwords method
UserSchema.methods.comparePasswords = async function (enteredPassword: string, storedPasswordHash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(enteredPassword, storedPasswordHash);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
}


export const User: Model<IUser> = mongoose.model('User', UserSchema);