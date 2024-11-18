import { Schema, model, models, Document } from "mongoose";

export interface IPartsList extends Document {
    partName: string[];
    
}

const PartsListSchema = new Schema({
    partName: { type: [String], required: true },
});

const PartsList = models.PartsList || model('PartsList', PartsListSchema);

export default PartsList;

