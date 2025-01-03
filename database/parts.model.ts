import { Schema, model, models, Document } from "mongoose";

export interface IPart extends Document {
  productNumber: string;
  printerName?: string;
  parts: {
      partsName: string;
      maxParts: number;
      part: {
          _id: string;
          barcode?: string;
          location?: string;
          from?: Schema.Types.ObjectId;
          to?: Schema.Types.ObjectId;
          used: boolean;
          createdOn?: Date;
      }[];
  };
}

const PartSchema = new Schema({
  productNumber: { type: String, required: true },
  printerName: { type: String, required: false },
  parts: [{
      partsName: { type: String, required: true },
      maxParts: { type: Number, required: true },
      part: [
          {
              barcode: { type: String, required: false },
              location: { type: String, required: false },
              from: { type: Schema.Types.ObjectId, ref: 'Printer', required: false },
              to: { type: Schema.Types.ObjectId, ref: 'Printer', required: false },
              used: { type: Boolean, required: true },
              createdOn: { type: Date, default: Date.now, required: false}
          },
      ],
  }],
});

const Parts = models.Parts || model<IPart>("Parts", PartSchema);

export default Parts;