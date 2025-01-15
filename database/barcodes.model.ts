import { Schema, model, models, Document } from "mongoose";
import { string } from "zod";

export interface IBarcodes extends Document {
  parts: number;
  printers: number;
  pallets: number;
  storage: string;
  
}

const BarcodesSchema = new Schema({
    parts: { type: Number, required: true },
    printers: { type: Number, required: true },
    pallets: { type: Number, required: true },
    storage: { type: String, required: true },
});

const Barcodes = models.Barcodes || model("Barcodes", BarcodesSchema);
export default Barcodes;