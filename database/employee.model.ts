import { Schema, model, models, Document } from "mongoose";

export interface IEmployee extends Document {
  name: string;
  lastName: string;
  nickName?: string;
  department: string;
}

const EmployeeSchema = new Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  nickName: { type: String },
  department: { type: String, required: true }, // Указываем отдел, к которому принадлежит сотрудник
});

const Employee = models.Employee || model("Employee", EmployeeSchema);
export default Employee;