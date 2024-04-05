"use server"

import { connectToDatabase } from "../mongoose"
import { CreatePartModelParams, GetPartsParams, DeletePartsParams } from "./shared.types";
import Part from "@/database/part.model";
import { revalidatePath } from "next/cache";

// CreatePalletModelParams took from shared.types.d.ts 
// to create a new printer model 

export async function createPartModel(params:CreatePartModelParams){
    try {
      connectToDatabase();
  
      const { pn, name, path} = params;
  
      const existingPart = await Part.findOne({ pn, name });
      if (existingPart) {
        // If a printer with the same make and model exists, return an error message
        return "This printer already exists in the database";
    }
  
    const newPart = await Part.create({ pn, name });
      
    revalidatePath(path);
  } catch (error) {
      // Log any errors
      console.log("Error:", error);
      // Return an error message
      return "An error occurred while creating the printer";
  }
}

export async function getParts(params: GetPartsParams){
    try {
      // Connect to the database
      await connectToDatabase();
  
      // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
      const parts = await Part.find({}).lean()
  
      // //.populate({path: "tags", model: Tag})
      // //.populate({path: 'author', model: User}) 
      return{parts}
  
    } catch (error) {
      
      throw error;
    }
  }

  export async function deletePart(params: DeletePartsParams){
    try {
        // Connect to the database
        await connectToDatabase();
    
        const { partId, path } = params;
    
        // Find the pallet by its ID and delete it
        await Part.findByIdAndDelete(partId);
    
        // Revalidate the path
        revalidatePath(path);
    
    
      } catch (error) {
        // Log any errors
        console.log("Error:", error);
        // Return an error message
        return "An error occurred while deleting the printer";
      }
  }

