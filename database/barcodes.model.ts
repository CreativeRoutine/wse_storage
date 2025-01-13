import { Schema, model, models, Document } from "mongoose";

export interface IBarcodes extends Document {
  parts: string;
  printers: string;
  pallets: string;
  storage: string;
  
}

const BarcodesSchema = new Schema({
    parts: { type: String, required: true },
    printers: { type: String, required: true },
    pallets: { type: String, required: true },
    storage: { type: String, required: true },
});

const Barcodes = models.Barcodes || model("Barcodes", BarcodesSchema);
export default Barcodes;