import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  darkMode?: boolean;
  notifications?: boolean;
}

const SettingsSchema = new Schema<ISettings>({
  darkMode: {
      type: Boolean,
      default: false
  },
  notifications: {
      type: Boolean,
      default: true
  }
});

export const Settings: Model<ISettings> = mongoose.model('Settings', SettingsSchema);
