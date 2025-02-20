import {Schema, model, models, Document} from 'mongoose';

export interface TaskAdd extends Document {
    name: string;
    // locker: string;
    // printers: Schema.Types.ObjectId[];
    // seller: Schema.Types.ObjectId;
    // price: number;
    // createdAt: Date;
    // completedAt: Date;
}

const TaskSchema = new Schema({
    name: {type: String, required: true},
    // locker: {type: String, required: true},
    // printers: [{type: Schema.Types.ObjectId, ref: 'Printer', required: false}],
    // seller: {type: Schema.Types.ObjectId,  required: false},
    // price: {type: Number, required: false},
    // createdAt: {type: Date, default: Date.now, required: true},
    // completedAt: {type: Date, default: Date.now, required: false},
})

const Task = models.Task || model('Task', TaskSchema);

export default Task;