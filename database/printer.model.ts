import { Schema, model, models, Document } from "mongoose";

export interface IPrinter extends Document {
    ponumber?: string;
    createdOn: Date;
    sn?: string;
    productNumber: string;
    barcode: string;
    pallet?: Schema.Types.ObjectId;
    updates: {
        user: Schema.Types.ObjectId;
        techStart: Date;
        techEnd: Date;
        condition: string[];
        workable: boolean;
        repariable: boolean;
        changedParts: string[];
        tasksPerformed: string[];
        price: number;
        updatedAt: Date;
    }[];
    name: string;
}

const PrinterSchema = new Schema({
    ponumber: { type: String, required: false },
    createdOn: { type: Date, default: Date.now },
    sn: { type: String, required: true },
    productNumber: { type: String, required: true},
    barcode: { type: String, required: true },
    pallet: { type: Schema.Types.ObjectId, ref: 'Pallet', required: false },
    updates: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        techStart: { type: Date, required: true },
        techEnd: { type: Date, required: true },
        condition: [{ type: String, required: false }],
        workable: { type: Boolean, required: false },
        repariable: { type: Boolean, required: false },
        changedParts: [{ type: String, required: false }],
        tasksPerformed: [{ type: String, required: false }],
        price: { type: Number, required: false },
        updatedAt: { type: Date, default: Date.now, required: true },
    }],
    name: { type: String, required: false },
});

const Printer = models.Printer || model('Printer', PrinterSchema);

export default Printer;


// export interface IPrinter extends Document {
//     ponumber?: string;
//     createdOn: Date;
//     sn?: string;
//     productNumber: string;
//     barcode: string;
//     pallet?: Schema.Types.ObjectId;
//     tech: Schema.Types.ObjectId[];
//     techStart: Date;
//     techEnd: Date;
//     cleaner: Schema.Types.ObjectId[];
//     cleanerStart: Date;
//     cleanerEnd: Date;
//     condition: string[];
//     workable: boolean;
//     repariable: boolean;
//     changedParts: string[];
//     tasksPerformed: string[];
//     price: number;
//     name: string;
// }

// const PrinterSchema = new Schema({
//     ponumber: { type: String, required: false },
//     createdOn: { type: Date, default: Date.now },
//     sn: { type: String, required: true },
//     productNumber: { type: String, required: true},
//     barcode: { type: String, required: true },
//     pallet: { type: Schema.Types.ObjectId, ref: 'Pallet', required: false},
//     tech: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//     techStart: { type: Date, required: false },
//     techEnd: { type: Date, required: false },
//     cleaner: [{ type: Schema.Types.ObjectId, ref: 'User' }],
//     cleanerStart: { type: Date, required: false },
//     cleanerEnd: { type: Date, required: false },
//     condition: [{ type: String, required: false }],
//     workable: { type: Boolean, required: false },
//     repariable: { type: Boolean, required: false },
//     changedParts: [{ type: String, required: false }],
//     tasksPerformed: [{ type: String, required: false }],
//     price: { type: Number, required: false },
//     name: { type: String, required: false },
// });

// const Printer = models.Printer || model('Printer', PrinterSchema);

// export default Printer;