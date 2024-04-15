import { Schema, model, models, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  admin: boolean;
  supervisor: boolean;
  name: string;
  username?: string;
  email?: string;
  department?: string;
  password?: string;
  printers: Schema.Types.ObjectId[];
  joinedAt: Date;
  picture?: string;
  reputation?: number;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  admin: { type: Boolean, default: false },
  supervisor: { type: Boolean, default: false },
  name: { type: String, required: true, unique: true},
  username: { type: String },
  email: { type: String },
  department: { type: String},
  password: { type: String },
  printers: [{ type: Schema.Types.ObjectId, ref: "Printer" }],
  joinedAt: { type: Date, default: Date.now },
  picture: { type: String },
  reputation: { type: Number, default: 0 },
});

const User = models.User || model("User", UserSchema);

export default User;
