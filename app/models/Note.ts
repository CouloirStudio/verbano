import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INote extends Document {
  audioLocation: string;
  dateCreated?: Date;
  transcription?: string;
  tags?: string[];
  projectId: typeof Schema.Types.ObjectId;
  noteName: string;
  noteDescription?: string;
}

const NoteSchema = new Schema<INote>({
  audioLocation: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  transcription: String,
  tags: [String],
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  noteName: {
    type: String,
    required: true,
  },
  noteDescription: String,
});

export const Note: Model<INote> = mongoose.model('Note', NoteSchema);
