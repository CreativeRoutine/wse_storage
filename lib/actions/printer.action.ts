"use server"

import { connectToDatabase } from "../mongoose";
import {  CreatePrinterParams, AddPrinterToPalletParams, GetPrintersParams, GetPrinterParams, GetPrinterPopulatedParams,  DeletePrinterParams, PinToPalletParams } from "./shared.types";
import Printer from "@/database/printer.model";
import { revalidatePath } from "next/cache";

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

export async function createPrinter(params: CreatePrinterParams) {
  try {
    connectToDatabase();

    const { sn, productNumber, barcode, path, createdOn } = params;

    // Searching if printer exists
    const existingPrinter = await Printer.findOne({ barcode: barcode });
    if (existingPrinter) {
      return "This printer already exists in the database";
    }

    // Создание нового принтера с _id паллета
    const newPrinter = await Printer.create({
      sn, 
      productNumber, 
      barcode,
      createdOn
    });

    revalidatePath(path);

    // Преобразование нового принтера в простой JavaScript объект
    const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));
    
    return newPrinterPlain;
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}

export async function addPrinterToPallet(params: AddPrinterToPalletParams) {
  try {
    connectToDatabase();

    const { sn, productNumber, barcode, paletBarcode, path } = params;

    // Search for an existing printer by serial number, product number, and barcode
    const existingPrinter = await Printer.findOne({ sn, productNumber, barcode });
    if (existingPrinter) {
      return "This printer already exists in the database";
    }

    // Searching for a pallet by barcode
    const pallet = await Pallet.findOne({ barcode: paletBarcode });
    if (!pallet) {
      return "Pallet not found";
    }

    // Creating a new printer with the _id of the pallet
    const newPrinter = await Printer.create({
      sn, 
      productNumber, 
      barcode,
      pallet: pallet._id, // Используем _id найденного паллета
    });

    // Afer creating a new printer, we add it to the pallet
    await Pallet.findByIdAndUpdate(pallet._id, { $push: { printers: newPrinter._id } });


    revalidatePath(path);

    // Преобразование нового принтера в простой JavaScript объект
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
    const printers = await Printer.find({})

    // .populate({path: "pallets", model: Pallet})
    // //.populate({path: 'author', model: User}) 
    return{printers}

  } catch (error) {
    
    throw error;
  }
}

export async function getPrinterPopulated(params: GetPrinterPopulatedParams){
  try {
    // Connect to the database
    await connectToDatabase();

    const {barcode} = params;

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printers = await Printer.find({barcode: barcode})

    .populate({path: "pallet", model: Pallet})
    // //.populate({path: 'author', model: User}) 
    return{printers}

  } catch (error) {
    
    throw error;
  }
}

export async function getPrinter(params: GetPrinterParams){
  
  const barcode = params.barcode;

  try {
    // Connect to the database
    await connectToDatabase();

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    // .lean() 
    const printer = await Printer.find({barcode: barcode}).lean()

    // //.populate({path: "tags", model: Tag})
    // //.populate({path: 'author', model: User}) 
    return{printer}

  } catch (error) {
    
    throw error;
  }
}

// export async function getPrinterById(params: GetPrinterByIdParams){
  
//   const _id = params._id;

//   try {
//     // Connect to the database
//     await connectToDatabase();

//     // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
//     // .lean() 
//     const printer = await Printer.find({barcode: barcode}).lean()

//     // //.populate({path: "tags", model: Tag})
//     // //.populate({path: 'author', model: User}) 
//     return{printer}

//   } catch (error) {
    
//     throw error;
//   }
// }

export async function deletePrinter(params:DeletePrinterParams) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { barcode, path } = params;
    const printer = await Printer.find({barcode: barcode});

    let printerPallet;

    if(printer[0].pallet){
      printerPallet = JSON.parse(JSON.stringify(printer[0].pallet));

      await Pallet.findByIdAndUpdate(
        printerPallet, 
        { $pull: { printers: printer[0]._id } },
        { new: true }
      )
    }

    // Find the pallet by its ID and delete it
    await Printer.findOneAndDelete({barcode: barcode});

    // Revalidate the path
    revalidatePath(path);


  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return "An error occurred while deleting the printer";
  }
}

export async function unPinPrinter(params:DeletePrinterParams) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { barcode, path } = params;
    const printer = await Printer.find({barcode: barcode});

    let printerPallet;

    if(printer[0].pallet){
      // find pallet by printer id
      printerPallet = JSON.parse(JSON.stringify(printer[0].pallet));

      // clean pallet from printer
      await Pallet.findByIdAndUpdate(
        printerPallet, 
        { $pull: { printers: printer[0]._id } },
        { new: true }
      )

      // clean printer from pallet
      await Printer.findByIdAndUpdate(
        printer[0]._id, 
        { $unset: { pallet: "" } },
        { new: true }
      )
    }

    // Revalidate the path
    revalidatePath(path);


  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return "An error occurred while deleting the printer";
  }
}

export async function PinPrinterToPallet(params:PinToPalletParams) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { barcode, palletBarcode, path } = params;

    const pallet = await Pallet.findOne({barcode: palletBarcode});
    if (!pallet) {
      console.log("Pallet not found");
      return "Pallet not found";
    }
    const printer = await Printer.findOne({barcode: barcode});
    
    await Printer.findByIdAndUpdate(printer._id, { $set: { pallet: pallet._id } });
    await Pallet.findByIdAndUpdate(pallet._id, { $push: { printers: printer._id } });


    // Revalidate the path
    revalidatePath(path);
  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return "An error occurred while deleting the printer";
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






