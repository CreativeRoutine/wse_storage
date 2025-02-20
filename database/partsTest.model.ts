import { Schema, model, models, Document, Types } from "mongoose";

export interface IPartsTest extends Document {
    ponumber: string;
    name: string;
    location: string;
    barcode: string;
    createdOn: Date;
    printer?: Types.ObjectId; // Ссылка на принтер, может быть пустой
}

const PartsTestSchema = new Schema<IPartsTest>({
    ponumber: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    barcode: { type: String, required: true },
    createdOn: { type: Date, default: Date.now },
    printer: { type: Schema.Types.ObjectId, ref: 'Printer', required: false }, // Необязательная ссылка на принтер
});

const PartsTest = models.PartsTest || model<IPartsTest>('PartsTest', PartsTestSchema);

export default PartsTest;