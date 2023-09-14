import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITemplate extends Document {
  templateName: string;
  templateDescription?: string;
  prompt?: string;
}

const TemplateSchema = new Schema<ITemplate>({
  templateName: {
    type: String,
    required: true
  },
  templateDescription: String,
  prompt: String
});

export const Template: Model<ITemplate> = mongoose.model('Template', TemplateSchema);
