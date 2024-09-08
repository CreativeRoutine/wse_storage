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
        pagesNumber: number;
        tested: string[];
        timeSpent: number;
    }[];
    name: string;
    preview: string;
}

const PrinterSchema = new Schema({
    ponumber: { type: String, required: false },
    createdOn: { type: Date, default: Date.now },
    sn: { type: String, required: true },
    productNumber: { type: String, required: true},
    barcode: { type: String, required: true },
    pallet: { type: Schema.Types.ObjectId, ref: 'Pallet', required: false },
    tasksPerformed: [{
        date: { type: Date, default: Date.now },
        user: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
        overallCondition: { type: String, required: false },
        cleanliness: { type: String, required: false },
        workable: { type: Boolean, required: false },
        repariable: { type: Boolean, required: false },
        changedParts: [{ type: String, required: false }],
        afterRefurbish: { type: String, required: false },
        pagesNumber: { type: Number, required: false },
        tested: [{ type: String, required: false }],
        timeSpent: { type: Number, required: false },
    }],
    name: { type: String, required: false },
    preview: { type: String, required: false },
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