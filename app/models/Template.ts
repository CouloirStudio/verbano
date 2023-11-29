import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Interface for ITemplate object
 */
interface ITemplate extends Document {
  templateName: string;
  templateDescription?: string;
  prompt?: string;
}

/**
 * MongoDB schema for a Template document.
 */
const TemplateSchema = new Schema<ITemplate>({
  templateName: {
    type: String,
    required: true,
  },
  templateDescription: String,
  prompt: String,
});

export const Template: Model<ITemplate> = mongoose.model(
  'Template',
  TemplateSchema,
);
