// actions/supplierActions.ts
"use server";
import Supplier from "@/database/supplier.model";
import { connectToDatabase } from "../mongoose";
import { GetSuppliersParams, UpdateSuppliersName, DeleteSupplierParams } from "./shared.types";
import { revalidatePath } from "next/cache";
import Pallet from "@/database/pallet.model";

export async function getAllSuppliers(params: GetSuppliersParams){
  try {
    await connectToDatabase();
    const suppliers = await Supplier.find({}).sort({ field: -1 });
    return { suppliers };
  } catch (error) {
    throw error;
  }
}

export async function getSupplier(_id: string) {
  try {
    await connectToDatabase();
    const supplier = await Supplier.findOne({_id: _id}).lean();
    return supplier;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Error fetching suppliers");
  }
}

// export async function getSupplierPopulated(_id: string) {
//   try {
//     await connectToDatabase();
//     const supplier = await Supplier.findOne({_id: _id})
//     .populate({path: "pallet", model: Pallet})
//     .lean();
//     return supplier;
//   } catch (error) {
//     console.error("Error fetching suppliers:", error);
//     throw new Error("Error fetching suppliers");
//   }
// }

export async function updateSupplier(params: UpdateSuppliersName) {
  try {
    await connectToDatabase();
    const { _id, name, path } = params;
    const supplier = await Supplier.findOne({ _id });
    if (!supplier) {
      return "This supplier does not exist in the database";
    }
    await Supplier.findOneAndUpdate(supplier._id, { $set: { name: name } });
    revalidatePath(path);
    return { message: 'Supplier updated successfully' };
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Error updating supplier");
  }
}

export async function deleteSupplier(params: DeleteSupplierParams) {
  try {
    await connectToDatabase();
    const { _id, path } = params;
    const supplier = await Supplier.findOne({ _id: _id });


    if (!supplier) {
      return  "This supplier does not exist in the database" ;
    }
    if (supplier.pallets.length > 0 && supplier.printers.length > 0) {
      return  "This supplier has pallets or printers. Please delete them first" ;
    }
    await Supplier.deleteOne({ _id: supplier._id });

    revalidatePath(path);
    // return { success: "Supplier deleted successfully" };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw new Error("Error deleting supplier");
  }
}
