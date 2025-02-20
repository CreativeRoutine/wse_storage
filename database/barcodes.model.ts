import { Schema, model, models, Document } from "mongoose";
import { string } from "zod";

export interface IBarcodes extends Document {
  parts?: number;
  printers?: number;
  pallets?: number;
  storage?: string; 
}

const BarcodesSchema = new Schema({
    parts: { type: Number, required: false },
    printers: { type: Number, required: false },
    pallets: { type: Number, required: false },
    storage: { type: String, required: false },
});

const Barcodes = models.Barcodes || model("Barcodes", BarcodesSchema);
export default Barcodes;