"use server"
import Barcodes from "@/database/barcodes.model";
import { connectToDatabase } from "../mongoose"
import { CreatePalet, } from "./shared.types";
import { revalidatePath } from "next/cache";
// import { any } from "zod";



export async function createBarcodes(params: CreatePalet) {
  try {
    connectToDatabase();

    const {  barcode, location, path } = params;

    const existingPallet = await Barcodes.findOne({ barcode: barcode });

    if (existingPallet) {
      
      return { success: false, message: "An error occurred while creating the pallet", info: "This pallet already exists in the database"};
      
    } else {
    }
    
    // Создание нового палета
    const newPalet = await Barcodes.create({
      barcode,
      location: "",
      createdOn: new Date(),
      printers: []
    });

    newPalet.save();

    const paletId = JSON.parse(JSON.stringify(newPalet._id));
    
    revalidatePath(path);
    return { success: true, message: "Pallet created successfully!", paletId };

  } catch (error) {
    return "An error occurred while creating the pallet";
    console.log("Error:", error);
  }
}
