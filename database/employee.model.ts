import { Schema, model, models, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  lastName: string;
  nickName?: string;
  department: string;
  active?: boolean;
  printers?: Schema.Types.ObjectId[];
}

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String },
  department: { type: String, required: true }, // Указываем отдел, к которому принадлежит сотрудник
  active: { type: Boolean, default: true }, // Указываем активен ли сотрудник
  printers: [
    {
      printerId: { type: Schema.Types.ObjectId, ref: "Printer", required: true },
      timeSpent: { type: Number, required: false },
      date: { type: Date, default: Date.now, required: false },
    },
  ],
});

const Employee = models.Employee || model("Employee", EmployeeSchema);
export default Employee;