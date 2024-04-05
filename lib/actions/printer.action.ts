"use server"

import { connectToDatabase } from "../mongoose";
import {  CreateProductPrinterParams, CreatePrinterModelParams, DeletePrinterModelParams, FindPrinterBySnParams, GetPrintersParams, GetPrinterParams } from "./shared.types";
import Printer from "@/database/makes.model";
import ProductPrinter from "@/database/printer.model";
import { revalidatePath } from "next/cache";
import { updatePalet } from "./pallet.action";
import Pallet from "@/database/pallet.model";

// export async function createPrinter(params:any) {

//   try {
//     // create printer
//     connectToDatabase ();


//     const { make, pModel, path} = params;

//     // create question from model
//     const printer = await Printer.create({make,pModel});

//       const printersDocument = [];

//       // Add printers to pallet or add them later.
//       // model taken from printer.model.ts

//     // Add the printer to the DB
//     for (const mk of make){
//       const existingMk = await Printer.findOneAndUpdate(
//         // this parameter allows us to find the printer by its make
//         {name: {$regex: new RegExp(`^${mk}$`, "i")}},
//         // this parameter allows us to update the printer by its make
//         {$setOnInsert: {name: mk}, $push: {printers: printer._id}},
//         // this parameter allows us to create a new printer if it does not exist
//         {upsert: true, new: true}
//       )
//       printersDocument.push(existingMk._id);
//     }

//     await Printer.findByIdAndUpdate(printer._id, {$push: {make: {$each: printersDocument}}});

//     // Create an interaction between the printer and the pallet
//     } catch(error){
//           console.log("We faced with error:", error)
//       }
// }

// CreatePrinterModelParams took from shared.types.d.ts 
// to create a new printer model 
export async function createPrinter(params: CreateProductPrinterParams) {
  try {
    connectToDatabase();

    const { sn, pnum, barcode, paletSn, path } = params;

    const existingPrinter = await ProductPrinter.findOne({ sn });
    if (existingPrinter) {
      // If a printer with the same make and model exists, return an error message
      return "This printer already exists in the database";
    }

    // Create a new printer
    const newPrinter = await ProductPrinter.create({ sn, pnum, paletSn, barcode });
    revalidatePath(path);

    // Convert the new printer to a plain JavaScript object
    
    const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));
    
    
    return newPrinterPlain;
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}

export async function getPrinters(params: GetPrintersParams){
  try {
    // Connect to the database
    await connectToDatabase();

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printers = await ProductPrinter.find({}).lean()

    // //.populate({path: "tags", model: Tag})
    // //.populate({path: 'author', model: User}) 
    return{printers}

  } catch (error) {
    
    throw error;
  }
}

export async function getPrinter(params: GetPrinterParams){
  console.log("THIS IS ACTION INIT -> ")
  const barcode = params.barcode;
  console.log("THIS IS BARCODE from ACTION INIT -> ", barcode)

  try {
    // Connect to the database
    await connectToDatabase();

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    // .lean() 
    const printer = await ProductPrinter.find({barcode: barcode}).lean()

    // //.populate({path: "tags", model: Tag})
    // //.populate({path: 'author', model: User}) 
    return{printer}

  } catch (error) {
    
    throw error;
  }
}

// export async function createPrinterModel(params:CreatePrinterModelParams) {
//   try {
//       connectToDatabase();

//       const { make, model, pnum, path} = params;

//       const existingPrinter = await Printer.findOne({ make, pModel: model, pnum });
//       if (existingPrinter) {
//         // If a printer with the same make and model exists, return an error message
//         return "This printer already exists in the database";
//     } else {return "This printer does not exists. OK";}

//     const newPrinter = await Printer.create({ make, pModel: model, pnum });
      
//     revalidatePath(path);
//   } catch (error) {
//       // Log any errors
//       console.log("Error:", error);
//       // Return an error message
//       return "An error occurred while creating the printer";
//   }
// }



// export async function deletePrinterModel(params:DeletePrinterModelParams) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     const { printerId, path } = params;

//     // Find the printer by its ID and delete it
//     await Printer.findByIdAndDelete(printerId);

//     // Revalidate the path
//     revalidatePath(path);


//   } catch (error) {
//     // Log any errors
//     console.log("Error:", error);
//     // Return an error message
//     return "An error occurred while deleting the printer";
//   }
// }

// export async function findPrinterBySn(params:FindPrinterBySnParams) {
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     const { sn } = params;

//     // Find the printer by its serial number
//     const printer = await Printer.find({ sn }).lean();
//     console.log("SOME RESULT HERE =>>>>", printer)
//     return { printer };
//   } catch (error) {
//     // Log any errors
//     console.log("Error:", error);
//     // Return an error message
//     return "An error occurred while finding the printer";
//   }
// }






