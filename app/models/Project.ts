import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
}

const ProjectSchema = new Schema<IProject>({
  name: {
    type: String,
    required: true,
  },
  description: String,
});

export const Project: Model<IProject> = mongoose.model(
  'Project',
  ProjectSchema,
);
