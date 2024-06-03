"use server"

import { connectToDatabase } from "../mongoose";
import {  CreateMakesParams, GetAllMakesParams } from "./shared.types";
import Printer from "@/database/printer.model";
import { revalidatePath } from "next/cache";
import Makes from "@/database/makes.model";

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