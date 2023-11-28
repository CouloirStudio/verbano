import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INote extends Document {
  audioLocation?: string;
  dateCreated?: Date;
  transcription?: string;
  progress?: {
    percentage: number;
    secondsLeft: number;
  };
  tags?: string[];
  noteName: string;
  noteDescription?: string;
  summary?: string;

  getProjectId(): Promise<String | null>;
}

const NoteSchema = new Schema<INote>({
  audioLocation: {
    type: String,
    required: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  transcription: String,
  tags: [String],
  noteName: {
    type: String,
    required: true,
  },
  noteDescription: String,
  summary: String,
  progress: {
    percentage: {
      type: Number,
      default: 0,
    },
    secondsLeft: {
      type: Number,
      default: 0,
    },
  },
});

NoteSchema.methods.getProjectId = async function (
  this: INote,
): Promise<string | null> {
  const Project = mongoose.model('Project');

  // Find a project where the 'notes.note' field matches this note's _id
  const project = await Project.findOne({ 'notes.note': this._id });

  if (project) {
    return project._id;
  }

  return null;
};

export const Note: Model<INote> = mongoose.model('Note', NoteSchema);
