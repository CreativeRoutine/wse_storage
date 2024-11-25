import { Schema, model, models, Document } from "mongoose";

export interface IPrinter extends Document {
    ponumber?: string;
    createdOn: Date;
    sn?: string;
    productNumber: string;
    barcode: string;
    pallet?: Schema.Types.ObjectId;
    tasksPerformed: {
        date: Date;
        user: Schema.Types.ObjectId;
        overallCondition: string;
        cleanliness: string;
        workable: boolean;
        repariable: boolean;
        changedParts: string[];
        afterRefurbish: string;
        disassembled: Schema.Types.ObjectId[];
        pagesNumber: number;
        tested: string[];
        timeSpent: number;
        additionalInfo: string;
        status: string;
    }[];
    name: string;
    preview: string;
}

const PrinterSchema = new Schema({
    ponumber: { type: String, required: false },
    createdOn: { type: Date, default: Date.now },
    sn: { type: String, required: true },
    productNumber: { type: String, required: true, index: true },
    barcode: { type: String, required: true, unique: true },
    pallet: { type: Schema.Types.ObjectId, ref: 'Pallet', required: false },
    tasksPerformed: [{
        date: { type: Date, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
        overallCondition: { type: String, required: true },
        cleanliness: { type: String, required: false },
        workable: { type: Boolean, required: false },
        repariable: { type: Boolean, required: false },
        changedParts: [{ type: String, required: false }],
        afterRefurbish: { type: String, required: false },
        disassembled: [{ type: Schema.Types.ObjectId, ref: "Parts", required: false }],
        pagesNumber: { type: Number, required: false },
        tested: [{ type: String, required: false }],
        // tested: [{ type: String, required: false }],
        timeSpent: { type: Number, required: false },
        additionalInfo: { type: String, required: false },
        status: { type: String, required: false },
    }],
    name: { type: String, required: false },
    preview: { type: String, required: false },
});

const Printer = models.Printer || model('Printer', PrinterSchema);

export default Printer;

