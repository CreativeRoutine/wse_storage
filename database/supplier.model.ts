import { Schema, model, models, Document } from "mongoose";

export interface ISupplier extends Document {
    ponumber: string;
    name?: string;
    createdOn: Date;
    // pallets: Schema.Types.ObjectId[];
    pallets: {
        barcode: string;
        createdOn: Date;
        price?: number;
        printers?: Schema.Types.ObjectId[];  
        completedOn: Date;
    }[];
    printers: Schema.Types.ObjectId[];

}

const SupplierSchema = new Schema({
    ponumber: { type: String, required: true },
    name: { type: String, required: false },
    createdOn: { type: Date, default: Date.now, required: true },
    pallets: [
        {
            barcode: { type: String, required: true },
            createdOn: { type: Date, default: Date.now, required: true },
            price: { type: Number, required: false },
            printers: [{ type: Schema.Types.ObjectId, ref: 'Printer', required: false }],

        }
    ],
    printers: [{ type: Schema.Types.ObjectId, ref: 'Printer'}],
});

const Supplier = models.Supplier || model('Supplier', SupplierSchema);

export default Supplier;