import {Schema, model, models, Document} from 'mongoose';

export interface PalletAdd extends Document {
    sn: string;
    barcode: string;
    location: string;
    ponumber: string;
    price: number;
    printers: Schema.Types.ObjectId[];
    creator: Schema.Types.ObjectId;
    active: boolean;
    createdOn: Date;
    completedOn: Date;
    // seller: Schema.Types.ObjectId;
    // completedAt: Date;
}

const PalletSchema = new Schema({
    sn: {type: String, required: true},
    barcode: {type: String, required: true},
    location: {type: String, required: false},
    ponumber: {type: String, required:false},
    price: {type: Number, required: false},
    printers: [{type: Schema.Types.ObjectId, ref: 'Printer', required: false}],
    creator: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    active: {type: Boolean, default: false, required: false},
    createdOn: {type: Date, default: Date.now, required: true},
    completedOn: {type: Date, required: false},
})

const Pallet = models.Pallet || model('Pallet', PalletSchema);

export default Pallet;