// actions/supplierActions.ts
"use server";
import Supplier from "@/database/supplier.model";
import { connectToDatabase } from "../mongoose";
import { GetSuppliersParams } from "./shared.types";

export async function getSuppliers(params: GetSuppliersParams){
  try {
    // Connect to the database
    await connectToDatabase();

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const suppliers = await Supplier.find({}).sort({ field: -1 })

    return{suppliers}

  } catch (error) {
    
    throw error;
  }
}

export async function getSuppliers1() {
  try {
    await connectToDatabase();
    const suppliers = await Supplier.find({}).lean();
    return suppliers;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Error fetching suppliers");
  }
}

export async function updateSupplier(id: string, name: string) {
  try {
    await connectToDatabase();
    await Supplier.findByIdAndUpdate(id, { name });
    return { message: 'Supplier updated successfully' };
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Error updating supplier");
  }
}
