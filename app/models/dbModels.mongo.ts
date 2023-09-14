import mongoose, {Document, Schema} from 'mongoose';


// ========== Project Model ==========

const ProjectSchema = new Schema({
  projectName: {
    type: String,
    required: true
  },
  projectDescription: String
});

const Project = mongoose.model<Document & any>('Project', ProjectSchema);

// ========== Report Model ==========

const ReportSchema = new Schema({
  reportName: {
    type: String,
    required: true
  },
  reportDescription: String,
  reportContent: String,
  dateCreated: {
    type: Date,
    default: Date.now
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
    required: true  // Each report is linked to one template
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true  // Each report must belong to a project
  },
  noteIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'  // Each report can reference multiple notes
  }]
});

const Report = mongoose.model<Document & any>('Report', ReportSchema);

// ========== Template Model ==========

const TemplateSchema = new Schema({
  templateName: {
    type: String,
    required: true
  },
  templateDescription: String,
  prompt: String
});

const Template = mongoose.model<Document & any>('Template', TemplateSchema);

// ========== Note Model ==========

const NoteSchema = new Schema({
  audioLocation: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  },
  transcription: String,
  tags: [String],
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true  // Each note must belong to a project
  },
	noteName: {
    type: String,
    required: true
  },
  noteDescription: String
});

const Note = mongoose.model<Document & any>('Note', NoteSchema);

// Exporting the models

export {
  Project,
  Report,
  Template,
  Note
};