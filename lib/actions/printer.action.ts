"use server"

import { connectToDatabase } from "../mongoose";
import {  CreatePrinterParams, AddPrinterToPalletParams, updatePrinterPONParams, GetPrintersParams, GetPrinterParams, GetPrinterPopulatedParams, UnPinPrinterParams, DeletePrinterParams, PinToPalletParams } from "./shared.types";
import Printer from "@/database/printer.model";
import { revalidatePath } from "next/cache";
import moment from 'moment-timezone';
import Pallet from "@/database/pallet.model";
import Supplier from "@/database/supplier.model";
import Makes from "@/database/makes.model";

// Old version
// export async function createPrinter(params: CreatePrinterParams) {
//   try {
//     connectToDatabase();

//     const { ponumber, sn, productNumber, barcode, path, createdOn } = params;

//     // Searching if printer exists
//     const existingPrinter = await Printer.findOne({ barcode: barcode });
//     if (existingPrinter) {
//       // console.log("This printer already exists in the database");
//       return "This printer already exists in the database";
//     }

//     // Создание нового принтера с _id паллета
//     const newPrinter = await Printer.create({
//       ponumber,
//       sn, 
//       productNumber, 
//       barcode,
//       createdOn
//     });

//     const existingSupplier = await Supplier.findOne({ponumber: ponumber});

//     if (existingSupplier){
//       console.log("THIS IS SUPPLIER ",existingSupplier)
//       const supplier = await Supplier.create({ponumber: ponumber, pallets:[], printers:[], name:""})
//     } else {
//       console.log("THIS IS SUPPLIER NOT FOUND")
//       // Используем _id нового палета для добавления в массив pallets поставщика
//       const supplier = await Supplier.findOneAndUpdate(
//         { ponumber:  ponumber},
//         { $set: { ponumber: ponumber }, $push: { printers: newPrinter._id } } , // Добавляем _id палета
//         { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
//       );
//     }

    

//     // Используем _id нового Добавляем _id принтера для добавления в массив Makes
//     const makes = await Makes.findOneAndUpdate(
//       { productNumber: productNumber },
//       { $set: { productNumber: productNumber }, $push: { printers: newPrinter._id } }, // Adding printer's produc number
//       { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
//     );


//     revalidatePath(path);

//     // Преобразование нового принтера в простой JavaScript объект
//     const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));
    
//     return newPrinterPlain;

//   } catch (error) {
//     // Return an error message
//     console.error("An error occurred while creating the printer:", error);
//     return "An error occurred while creating the printer";
//   }
// }

// New version
export async function createPrinter(params: CreatePrinterParams) {
  try {
    await connectToDatabase(); // Добавьте await, чтобы дождаться подключения к базе данных

    const { ponumber, sn, productNumber, barcode, path, createdOn } = params;

    // Searching if printer exists
    const existingPrinter = await Printer.findOne({ barcode: barcode });
    if (existingPrinter) {
      return "This printer already exists in the database";
    }

    // Создание нового принтера
    const newPrinter = await Printer.create({
      ponumber,
      sn, 
      productNumber, 
      barcode,
      createdOn
    });

    // const existingSupplier = await Supplier.findOne({ ponumber: ponumber });

    if (newPrinter ) {
      console.log("Printer done")
      // Обновляем существующего поставщика
      await Supplier.findOneAndUpdate(
        { ponumber: ponumber },
        { $push: { printers: newPrinter._id } },
        { new: true, upsert: true }
      );
    } else {
      console.log("Printer NOT done")
      // Создаем нового поставщика
      await Supplier.create({
        ponumber: ponumber,
        pallets: [],
        printers: [newPrinter._id],
        name: ""
      });
    }

    // Обновляем или создаем запись в Makes
    await Makes.findOneAndUpdate(
      { productNumber: productNumber },
      { $set: { productNumber: productNumber }, $push: { printers: newPrinter._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    revalidatePath(path);

    // Преобразование нового принтера в простой JavaScript объект
    const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));
    
    return newPrinterPlain;

  } catch (error) {
    // Возвращаем сообщение об ошибке
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}



export async function addPrinterToPallet(params: AddPrinterToPalletParams) {
  console.log("addPrinterToPallet", params)
  try {
    connectToDatabase();

    const { sn, productNumber, barcode, palletId, path } = params;

    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5); 

    // Search for an existing printer by serial number, product number, and barcode
    const existingPrinter = await Printer.findOne({ sn, productNumber, barcode });
    if (existingPrinter) {
      return "This printer already exists in the database";
    }

    // Searching for a pallet by barcode
    const pallet = await Pallet.findOne({ _id: palletId });
    if (!pallet) {
      return "Pallet not found";
    }

    // Creating a new printer with the _id of the pallet
    const newPrinter = await Printer.create({
      sn, 
      productNumber, 
      barcode,
      pallet: pallet._id, // Используем _id найденного паллета
      createdOn,
      ponumber: pallet.ponumber
    });

    // Afer creating a new printer, we add it to the pallet
    await Pallet.findByIdAndUpdate(pallet._id, { $push: { printers: newPrinter._id } });

    // Используем _id нового палета для добавления в массив pallets поставщика
    const supplier = await Supplier.findOneAndUpdate(
      { ponumber: pallet.ponumber },
      { $set: { ponumber: pallet.ponumber }, $push: { printers: newPrinter._id } }, // Добавляем _id палета
      { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    );

    // Используем _id нового Добавляем _id принтера для добавления в массив Makes
    const makes = await Makes.findOneAndUpdate(
      { productNumber: productNumber },
      { $set: { productNumber: productNumber }, $push: { printers: newPrinter._id } }, // Adding printer's produc number
      { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    );

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
    const printers = await Printer.find({}).sort({createdOn: -1})

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

    const {_id} = params;

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printer = await Printer.find({_id: _id})

    .populate({path: "pallet", model: Pallet})
    // .populate({path: "supplier", model: Supplier})
    // //.populate({path: 'author', model: User}) 
    return printer

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

export async function updatePrinterPON(params:updatePrinterPONParams){
  try {
    connectToDatabase();
    const { _id, ponumber, path} = params;

    // 1. Find the printer by its ID
    // 2. Update the printer's ponumber
    // 3. Find the supplier by the old ponumber and remove the printer from the supplier's printers array

    const printer = await Printer.findOne({ _id: _id });
    if (!printer) {
      return "This printer not exists in the database";
    }

    // 3. Find the supplier by the old ponumber and remove the printer from the supplier's printers array

    const oldPOnumber = printer.ponumber;

    const oldSupplier = await Supplier.findOne({ponumber: oldPOnumber});
    if (oldSupplier) {
      await Supplier.findOneAndUpdate({ponumber: oldPOnumber}, { $pull: { printers: printer._id } });
    }


    await Printer.findOneAndUpdate(printer._id, { $set: { ponumber: ponumber } });

    // Используем _id нового палета для добавления в массив pallets поставщика
    const supplier = await Supplier.findOneAndUpdate(
      { ponumber: ponumber },
      { $set: { ponumber: ponumber }, $push: { printers: printer._id } }, // Добавляем _id палета
      { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    );


    revalidatePath(path);
  } catch (error) {
      console.log("Error:", error);
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
    const { id, path } = params;
    
    const printerRaw = await Printer.find({_id: id});

    const printer = JSON.parse(JSON.stringify(printerRaw))

    let printerPallet;

    if(printer[0].pallet){
      printerPallet = JSON.parse(JSON.stringify(printer[0].pallet));

      await Pallet.findByIdAndUpdate(
        printerPallet, 
        { $pull: { printers: printer[0]._id } },
        { new: true }
      )
    }

    // Find Supplier by printer id
    await Supplier.findOneAndUpdate({ponumber: printer[0].ponumber}, { $pull: { printers: printer[0]._id } })

    // Find Makes by printer id and delete printer from Makes
    await Makes.findOneAndUpdate({productNumber: printer[0].productNumber}, { $pull: { printers: printer[0]._id } })


    // // Find the pallet by its ID and delete it
    await Printer.findOneAndDelete({_id: id});

    // Revalidate the path
    revalidatePath(path);


  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return "An error occurred while deleting the printer";
  }
}

export async function unPinPrinter(params:UnPinPrinterParams) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { id, printerId, path } = params;

    // clean pallet from printer
    await Pallet.findByIdAndUpdate(
      id, 
      { $pull: { printers: printerId } },
      { new: true }
    )

    // clean printer from pallet
    await Printer.findByIdAndUpdate(
      printerId, 
      { $unset: { pallet: "" } },
      { new: true }
    )
    
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
    const { id, palletBarcode, path } = params;

    const pallet = await Pallet.findOne({barcode: palletBarcode});
    if (!pallet) {
      return "Pallet not found";
    }
    const printer = await Printer.findOne({_id: id});
    
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






