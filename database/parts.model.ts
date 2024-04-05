import { Schema, model, models, Document } from "mongoose";

export interface IParts extends Document {
    barcode: string;
    name: string;
    make: string;
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

const PartsSchema = new Schema({
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    make: { type: String, required: true },
    // id: { type: Number, required: true, unique: true},
    // sn: { type: Schema.Types.ObjectId, required: true, unique: true},
    // palletSn: { type: Schema.Types.ObjectId, ref: 'Pallet', required: true },
    
    // tech: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // techStart: { type: Date, default: Date.now , required: true },
    // techEnd: { type: Date, required: true },
    // cleanerStart: { type: Date, default: Date.now, required: true },
    // cleanerEnd: { type: Date, required: true },
    // cleaner: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // condition: [{ type: Schema.Types.ObjectId, ref: 'Condition' }],
    // changedParts: [{ type: Schema.Types.ObjectId, ref: 'Parts' }],
    // timeSpent: { type: Number, required: true },
    // price: { type: Number, required: true }
});

const Parts = models.Parts || model('Parts', PartsSchema);

export default Parts;