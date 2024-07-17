// actions/supplierActions.ts
"use server";
import Supplier from "@/database/supplier.model";
import { connectToDatabase } from "../mongoose";
import { GetSuppliersParams, UpdateSuppliersName, DeleteSupplierParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Pallet from "@/database/pallet.model";
import Printer from "@/database/printer.model";
import { FilterQuery } from "mongoose";

export async function getAllSuppliers(params: GetSuppliersParams){
  try {
    await connectToDatabase();

    const {searchQuery} = params;

    const query: FilterQuery<typeof Supplier> = {};

    if(searchQuery){
      query.$or = [
        {ponumber: {$regex: new RegExp(searchQuery, "i")}},
        {name: {$regex: new RegExp(searchQuery, "i")}},
      ];
    }

    const suppliers = await Supplier.find(query).sort({ field: -1 });

    return { suppliers };
    
  } catch (error) {
    throw error;
  }
}

export async function getSupplier(_id: string) {
  try {
    await connectToDatabase();

    const supplier = await Supplier.findOne({_id: _id})
    .populate({ path: "printers", model: Printer, select: "barcode sn productNumber createdOn" })
    .populate({ path: "pallets", model: Pallet, select: "barcode location printers createdOn" })
    // .populate({path: "pallets", model: Pallet})
    
    .lean();

    return supplier;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Error fetching suppliers");
  }
}

// Messaging ready
export async function updateSupplier(params: UpdateSuppliersName) {
  try {
    await connectToDatabase();
    const { _id, name, path } = params;
    const supplier = await Supplier.findOne({ _id });
    if (!supplier) {
      return { success: false, message: "Supplier can't be deleted!", info: "Check if the supplier not exists in the database" }; 
    }
    await Supplier.findOneAndUpdate(supplier._id, { $set: { name: name } });
    revalidatePath(path);
    
    return { success: true, message: "Supplier's name updated successfully!"};


  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Error updating supplier");
  }
}

// Messaging ready
export async function deleteSupplier(params: DeleteSupplierParams) {
  try {
    await connectToDatabase();
    const { _id, path } = params;
    const supplier = await Supplier.findOne({ _id: _id });

    if (!supplier) {
      return { success: false, message: "Supplier can't be deleted!", info: "Check if the supplier not exists in the database" }; 
    }
    if (supplier.pallets.length > 0 || supplier.printers.length > 0) {
      return { success: false, message: "Supplier can't be deleted!", info: "Check if the supplier is not linked to any printer or pallet"}; 
    }
    await Supplier.deleteOne({ _id: supplier._id });

    revalidatePath(path);
    
    return { success: true, message: "Supplier deleted successfully!"};

    // return { success: "Supplier deleted successfully" };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw new Error("Error deleting supplier");
  }
}
