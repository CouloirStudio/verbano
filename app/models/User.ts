import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName?: string;
  password: string;
  refreshToken?: string;
  dateJoined?: Date;
  settings?: typeof Schema.Types.ObjectId;
  projects?: { project: typeof Schema.Types.ObjectId; position: number }[];
  googleId?: string;
}

const UserSchema = new Schema<IUser>({
  email: {
    // This is now the email, ensuring it's unique
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  dateJoined: {
    type: Date,
    default: Date.now,
  },
  settings: {
    type: Schema.Types.ObjectId,
    ref: 'Settings',
  },
  projects: [
    {
      project: { type: Schema.Types.ObjectId, ref: 'Project' },
      position: { type: Number },
    },
  ],
  googleId: {
    type: String,
    default: null,
  },
});

// Define the virtual for fullName
UserSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

export const User: Model<IUser> = mongoose.model('User', UserSchema);
