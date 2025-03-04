"use server"

import { connectToDatabase } from "../mongoose";
import {  CreateMakesParams, GetAllMakesParams,GetMakeByIdParams, UpdateMakePreviewParams, DeleteMakeParams, UpdateMakeName } from "./shared.types";
import Printer from "@/database/printer.model";
import Parts from "@/database/parts.model";
import { revalidatePath } from "next/cache";
import Makes from "@/database/makes.model";
import { constants } from "fs/promises";
import { FilterQuery } from "mongoose";

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

      const {searchQuery} = params;

      const query: FilterQuery<typeof Makes> = {};

      if(searchQuery){
        query.$or = [
          {productNumber: {$regex: new RegExp(searchQuery, "i")}},
          {name: {$regex: new RegExp(searchQuery, "i")}},
        ];
      }
  
      // Searching if printer exists
      const allMakes = await Makes.find(query).sort({ field: -1 });
      if (!allMakes) {
        return "There are NO makes in the database";
      }
  
      return (allMakes);
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

// Messaging ready
export async function deleteMake(params: DeleteMakeParams) {
  try {
    await connectToDatabase();
    const { _id, path } = params;
    const make = await Makes.findOne({ _id: _id });


    if (!make) {
      return { success: false, message: "Make can't be deleted!", info: "This Make does not exist in the database" }; 
    }
    if (make.printers.length != 0) {
      return { success: false, message: "Make can't be deleted!", info: "This supplier has pallets or printers. Please delete them first" }; 
    }
    await Makes.deleteOne({ _id: make._id });

    revalidatePath(path);
    return { success: true, message: "Supplier deleted successfully!"};

  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw new Error("Error deleting supplier");
  }
}

// Messaging ready
export async function updateMake(params: UpdateMakeName) {
  try {
    await connectToDatabase();
    const { _id, name, path } = params;

    // 1.
    const make = await Makes.findOne({ _id });
    if (!make) {
      return { success: false, message: "Make can't be updated!", info: "This Make does not exist in the database" }; 
    }

    await Makes.findOneAndUpdate({ _id: make._id }, { $set: { name: name } });

    // const printers = await Printer.find({productNumber: make.productNumber});
    
    // 2.
    const printersNames = await Printer.updateMany(
      { productNumber: make.productNumber }, 
      { $set: { name: name } }
    );

    // 
    // DELETED BECAUSE SECOND OPTIONS APPLIED
    // 
    // 3.
    // const parts = await Parts.findOneAndUpdate(
    //   {productNumber: make.productNumber}, 
    //   { $set: { printerName: name } },
    //   {new: true}
    // );

    revalidatePath(path);
    
    return { success: true, message: "Supplier updated successfully!"};
    
  } catch (error) {
    console.error("Error updating Make:", error);
    return false
  }
}

export async function updateMakePreview(params: UpdateMakePreviewParams) {
  try {
    await connectToDatabase();
    const { _id, preview, path } = params;

    // Найдем модель `Make` по _id
    const make = await Makes.findOne({ _id });
    if (!make) {
      return { success: false, message: "Make can't be updated!", info: "This Make does not exist in the database" }; 
    }

    // Обновим `Make` с новым значением поля `preview`
    await Makes.findOneAndUpdate({ _id: make._id }, { $set: { preview: preview } });

    // Найдем все принтеры, связанные с данным `Make`, по полю `productNumber`
    const printers = await Printer.find({ productNumber: make.productNumber });
    
    // Логируем количество найденных принтеров
    console.log("Printers found:", printers.length, printers);

    if (printers.length === 0) {
      return { success: false, message: "No printers found!", info: `No printers found for product number: ${make.productNumber}` };
    }

    // Обновляем все найденные принтеры
    const updateResult = await Printer.updateMany(
      { productNumber: make.productNumber },
      { $set: { preview: preview } },
      { writeConcern: { w: "majority" } }  // Убедитесь, что запись подтверждена большинством узлов
    );
    
    const printersToUpdate = await Printer.find({
      productNumber: make.productNumber,
      preview: { $ne: preview }  // Только если значение preview отличается
    });

    

    console.log("Update result:", updateResult);

    // Перегенерируем кэш страницы, если путь указан
    revalidatePath(path);

    return { success: true, message: `Make preview updated successfully! ${updateResult.modifiedCount} printers updated.` };

  } catch (error) {
    console.error("Error updating Make and Printers:", error);
    return { success: false, message: "An error occurred while updating the Make and Printers" };
  }
}

