import mongoose, { Schema, Document, Model } from 'mongoose';

interface IProject extends Document {
  projectName: string;
  projectDescription?: string;
}

const ProjectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: String,
});

export const Project: Model<IProject> = mongoose.model(
  'Project',
  ProjectSchema,
);
