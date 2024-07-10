"use server"

import { connectToDatabase } from "../mongoose";
import {  CreateMakesParams, GetAllMakesParams,GetMakeByIdParams, DeleteMakeParams, UpdateMakeName } from "./shared.types";
import Printer from "@/database/printer.model";
import { revalidatePath } from "next/cache";
import Makes from "@/database/makes.model";
import { constants } from "fs/promises";

export async function createMake(params: CreateMakesParams) {
  try {
    connectToDatabase();

    const { name, productNumber, path} = params;

    // Searching if printer exists
    const existingMake = await Makes.findOne({ producNumber: productNumber });
    if (existingMake) {
      // console.log("This printer already exists in the database");
      return "This printer already exists in the database";
    }

    // Создание нового принтера с _id паллета
    const newMake = await Makes.create({
        productNumber,
        name,
    });

    revalidatePath(path);

    // Преобразование нового принтера в простой JavaScript объект
    const newMakePlain = JSON.parse(JSON.stringify(newMake));
    
    return newMakePlain;
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}

export async function getAllMakes(params: GetAllMakesParams) {
    try {
      // Connect to the database
      connectToDatabase();
  
      // Searching if printer exists
      const allMakes = await Makes.find({});
      if (!allMakes) {
        // console.log("This printer already exists in the database");
        return "There are NO makes in the database";
      }
  
      return allMakes;
    } catch (error) {
      // Return an error message
      console.error("An error occurred while creating the printer:", error);
      return "An error occurred while creating the printer";
    }
  }

  export async function getMakeById(params: GetMakeByIdParams) {
    try {
      // Connect to the database
      connectToDatabase();

      const { _id, path } = params;
  
      // Searching if printer exists
      const makes = await Makes.find({_id: _id})
      .populate({path: 'printers', model: Printer, select: '_id sn barcode createdOn name'}).lean()
  
      if (!makes) {
        // console.log("This printer already exists in the database");
        return "There are NO makes in the database";
      }
  
      return makes[0]
    } catch (error) {
      // Return an error message
      console.error("An error occurred while creating the printer:", error);
      return "An error occurred while creating the printer";
    }
  }

  export async function deleteMake(params: DeleteMakeParams) {
    try {
      await connectToDatabase();
      const { _id, path } = params;
      const make = await Makes.findOne({ _id: _id });
  
  
      if (!make) {
        return  "This supplier does not exist in the database" ;
      }
      if (make.printers.length > 0) {
        return  "This supplier has pallets or printers. Please delete them first" ;
      }
      await Makes.deleteOne({ _id: make._id });
  
      revalidatePath(path);
      // return { success: "Supplier deleted successfully" };
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw new Error("Error deleting supplier");
    }
  }

  export async function updateMake(params: UpdateMakeName) {
    try {
      await connectToDatabase();
      const { _id, name, path } = params;

      const make = await Makes.findOne({ _id });
      if (!make) {
        return false;
      }

      await Makes.findOneAndUpdate({ _id: make._id }, { $set: { name: name } });

      // const printers = await Printer.find({productNumber: make.productNumber});
      
      const printersNames = await Printer.updateMany(
        { productNumber: make.productNumber }, 
        { $set: { name: name } }
      );

      revalidatePath(path);
      return  true ;
      
    } catch (error) {
      console.error("Error updating Make:", error);
      return false
    }
  }


// export async function updateMake(params: CreateMakesParams) {
//     try {
//       connectToDatabase();
  
//       const { name, productNumber, path} = params;
  
//       // Searching if printer exists
//       const existingMake = await Makes.findOne({ producNumber: productNumber });
//       if (existingMake) {
//         // console.log("This printer already exists in the database");
//         return "This printer already exists in the database";
//       }
  
//       // Создание нового принтера с _id паллета
//       const newMake = await Makes.create({
//           productNumber,
//           name,
//       });
  
  
  
//       // Используем _id нового Добавляем _id принтера для добавления в массив Makes
//       const makes = await Makes.findOneAndUpdate(
//         { productNumber: productNumber },
//         { $set: { productNumber: productNumber }, $push: { printers: newPrinter._id } }, // Adding printer's produc number
//         { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
//       );
  
  
//       revalidatePath(path);
  
//       // Преобразование нового принтера в простой JavaScript объект
//       const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));
      
//       return newPrinterPlain;
//     } catch (error) {
//       // Return an error message
//       console.error("An error occurred while creating the printer:", error);
//       return "An error occurred while creating the printer";
//     }
//   }