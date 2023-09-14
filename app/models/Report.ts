import mongoose, { Schema, Document, Model } from 'mongoose';

interface IReport extends Document {
  reportName: string;
  reportDescription?: string;
  reportContent?: string;
  dateCreated?: Date;
  templateId: typeof Schema.Types.ObjectId;
  projectId: typeof Schema.Types.ObjectId;
  noteIds?: typeof Schema.Types.ObjectId[];
}

const ReportSchema = new Schema<IReport>({
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
    required: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  noteIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
});

export const Report: Model<IReport> = mongoose.model('Report', ReportSchema);
