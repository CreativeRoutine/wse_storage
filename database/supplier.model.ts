import { Schema, model, models, Document } from "mongoose";

export interface ISupplier extends Document {
    ponumber: string;
    name?: string;
    pallets: Schema.Types.ObjectId[];
    // id: number;
    // sn: Schema.Types.ObjectId[];
    // palletSn: Schema.Types.ObjectId;
    // tech: Schema.Types.ObjectId[];
    // techStart: Date;
    // techEnd: Date;
    // cleanerStart: Date;
    // cleanerEnd: Date;
    // cleaner: Schema.Types.ObjectId[];
    // condition: Schema.Types.ObjectId[];
    // changedParts: Schema.Types.ObjectId[];
    // timeSpent: number;
    // price: number;
}

const SupplierSchema = new Schema({
    ponumber: { type: String, required: true },
    name: { type: String, required: false },
    pallets: [{ type: Schema.Types.ObjectId, ref: 'Pallet', required: false }],
});

const Supplier = models.Supplier || model('Supplier', SupplierSchema);

export default Supplier;