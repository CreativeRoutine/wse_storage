"use server"

import { connectToDatabase } from "../mongoose"
import { CreateWorkModelParams, GetWorksParams, DeleteWorkParams } from "./shared.types";
import Work from "@/database/tasks.model";
import { revalidatePath } from "next/cache";

// CreatePalletModelParams took from shared.types.d.ts 
// to create a new printer model 

export async function createWorkModel(params:CreateWorkModelParams){
    try {
      connectToDatabase();
  
      const { name, path} = params;
  
      const existingWork = await Work.findOne({ name });
      if (existingWork) {
        // If a printer with the same make and model exists, return an error message
        return "This printer already exists in the database";
    }
  
    const newWork = await Work.create({ name });
      
    revalidatePath(path);
  } catch (error) {
      // Log any errors
      console.log("Error:", error);
      // Return an error message
      return "An error occurred while creating the printer";
  }
}

export async function getWorks(params: GetWorksParams){
    try {
      // Connect to the database
      await connectToDatabase();
  
      // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
      const works = await Work.find({}).lean()
  
      // //.populate({path: "tags", model: Tag})
      // //.populate({path: 'author', model: User}) 
      return{works}
  
    } catch (error) {
      
      throw error;
    }
  }

  export async function deleteWork(params: DeleteWorkParams){
    try {
        // Connect to the database
        await connectToDatabase();
    
        const { workId, path } = params;
    
        // Find the pallet by its ID and delete it
        await Work.findByIdAndDelete(workId);
    
        // Revalidate the path
        revalidatePath(path);
    
    
      } catch (error) {
        // Log any errors
        console.log("Error:", error);
        // Return an error message
        return "An error occurred while deleting the printer";
      }
  }