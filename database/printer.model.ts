import { Schema, model, models, Document } from "mongoose";

export interface IPrinter extends Document {
    addedOn: Date;
    sn?: string;
    productNumber: string;
    barcode: string;
    pallet: Schema.Types.ObjectId;
    tech: Schema.Types.ObjectId[];
    techStart: Date;
    techEnd: Date;
    cleaner: Schema.Types.ObjectId[];
    cleanerStart: Date;
    cleanerEnd: Date;
    condition: string[];
    workable: boolean;
    repariable: boolean;
    changedParts: string[];
    tasksPerformed: string[];
    price: number;
}

const ProductPrinterSchema = new Schema({
    addedOn: { type: Date, default: Date.now },
    sn: { type: String, required: true },
    productNumber: { type: String, required: true},
    barcode: { type: String, required: true },
    pallet: { type: Schema.Types.ObjectId, ref: 'Pallet', required: true },
    tech: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    techStart: { type: Date, required: true },
    techEnd: { type: Date, required: true },
    cleaner: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    cleanerStart: { type: Date, required: true },
    cleanerEnd: { type: Date, required: true },
    condition: [{ type: String, required: true }],
    workable: { type: Boolean, required: true },
    repariable: { type: Boolean, required: true },
    changedParts: [{ type: String, required: true }],
    tasksPerformed: [{ type: String, required: true }],
    price: { type: Number, required: true }
});

const Printer = models.Printer || model('Printer', ProductPrinterSchema);

export default Printer;