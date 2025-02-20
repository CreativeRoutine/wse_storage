// models/genericPart.model.ts
import { Schema, model, models, Document, Types } from "mongoose";

export interface IGenericPart extends Document {
  barcode: string;
  location: string;
  partName: string;
  addedAt: Date;
}

const GenericPartSchema = new Schema<IGenericPart>({
  barcode: { type: String, required: true },
  location: { type: String, required: true },
  partName: { type: String, required: true },
  addedAt: { type: Date, default: Date.now },
});

const GenericPart = models.GenericPart || model<IGenericPart>('GenericPart', GenericPartSchema);

export default GenericPart;