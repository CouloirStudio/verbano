import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface for INote object
 */
export interface INote extends Document {
  audioLocation?: string;
  dateCreated?: Date;
  transcription?: string;
  tags?: string[];
  noteName: string;
  noteDescription?: string;
  summary?: string;

  getProjectId(): Promise<String | null>;
}

/**
 * MongoDB Schema for Note object
 */
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
});

/**
 * Function for retrieving the id of the project that a  note belongs to.
 * @param INote the note
 * @returns the project id
 */
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
