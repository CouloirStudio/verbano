import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  projectName: string;
  projectDescription?: string;
  notes: (typeof Schema.Types.ObjectId)[]; // Array of note IDs
}

const ProjectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

export const Project: Model<IProject> = mongoose.model(
  'Project',
  ProjectSchema,
);
