import {Schema, model, models, Document} from 'mongoose';

export interface MakesModel extends Document {
    productNumber: string;
    name?: string;
    preview?: string;
    printers?: Schema.Types.ObjectId[];
}

const MakesSchema = new Schema({
    productNumber: {type: String, required: true},
    name: {type: String, required: false},
    preview: {type: String, required: false},
    printers: [{type: Schema.Types.ObjectId, ref: 'Printer', required: false}],
})

const Makes = models.Makes || model('Makes', MakesSchema);

export default Makes;