import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface for an ISettings object.
 */
export interface ISettings extends Document {
  darkMode?: boolean;
  notifications?: boolean;
}

/**
 * MongoDB schema for settings document.
 */
const SettingsSchema = new Schema<ISettings>({
  darkMode: {
    type: Boolean,
    default: false,
  },
  notifications: {
    type: Boolean,
    default: true,
  },
});

export const Settings: Model<ISettings> = mongoose.model(
  'Settings',
  SettingsSchema,
);
