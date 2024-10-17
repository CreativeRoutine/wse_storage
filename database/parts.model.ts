import { Schema, model, models, Document } from "mongoose";

export interface IParts extends Document {
  printerName: string; // Имя принтера, которому принадлежат запчасти
  parts: {
    name: string;
    barcode: string;
    location: string;
    quantity: number;
  }[];
}

const PartsSchema = new Schema({
  printerName: { type: String, required: true }, // Имя принтера
  parts: [
    {
      name: { type: String, required: true }, // Название запчасти
      barcode: { type: String, required: true }, // Штрихкод детали
      location: { type: String, required: false }, // Местоположение детали
      quantity: { type: Number, required: true, default: 0 }, // Количество запчастей
    },
  ],
});

const Parts = models.Parts || model('Parts', PartsSchema);

export default Parts;
