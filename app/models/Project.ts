import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProject extends Document {
  projectName: string;
  projectDescription?: string;
  notes: { note: typeof Schema.Types.ObjectId; position: number }[]; // Array of note-position objects
  summaries: { summary: typeof Schema.Types.ObjectId; position: number }[]; // Array of summary-position objects
}

const ProjectSchema = new Schema<IProject>({
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: String,
  notes: [
    {
      note: { type: Schema.Types.ObjectId, ref: 'Note' },
      position: { type: Number },
    },
  ],
  summaries: [
    {
      summary: { type: Schema.Types.ObjectId, ref: 'Summary' },
      position: { type: Number },
    },
  ],
});

export const Project: Model<IProject> = mongoose.model(
  'Project',
  ProjectSchema,
);
