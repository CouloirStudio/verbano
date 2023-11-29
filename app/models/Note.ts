import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface for INote object
 */
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

  getOwnerId(): Promise<String | null>;
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

NoteSchema.methods.getOwnerId = async function (
  this: INote,
): Promise<string | null> {
  try {
    const User = mongoose.model('User');

    const projectID = await this.getProjectId();
    if (!projectID) return null;

    const project = await mongoose
      .model('Project')
      .findById(projectID, '_id')
      .exec();
    if (!project) return null;

    const owner = await User.findOne(
      { 'projects.project': project._id },
      '_id',
    ).exec();
    return owner ? owner._id : null;
  } catch (error) {
    console.error('Error finding note owner:', error);
    return null;
  }
};

export const Note: Model<INote> = mongoose.model('Note', NoteSchema);
