import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISummary extends Document {
  summaryName: string;
  summaryDescription?: string;
  content?: string;
  dateCreated?: Date;
  templateId?: typeof Schema.Types.ObjectId;
  projectId: typeof Schema.Types.ObjectId;
  noteIds?: (typeof Schema.Types.ObjectId)[];
}

const SummarySchema = new Schema<ISummary>({
  summaryName: {
    type: String,
    required: true,
  },
  summaryDescription: String,
  content: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'Template',
  },
  noteIds: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Note',
    },
  ],
});

export const Summary: Model<ISummary> = mongoose.model(
  'Summary',
  SummarySchema,
);
