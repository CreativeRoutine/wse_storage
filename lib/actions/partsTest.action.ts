// import { CreatePart } from '@/components/shared/parts/CreatePart';
"use server";

import { connectToDatabase } from "../mongoose";
import {  GetAllPartsParams, CreatePartParams} from "./shared.types";
import Printer from '@/database/printer.model'; // Модель принтера
import Parts from '@/database/parts.model'; // Модель запчастей
import { FilterQuery } from "mongoose";
import Makes from "@/database/makes.model";
import { Types } from "mongoose";
import GenericPart from "@/database/genericPart.model";

// MY IMPLEMENTATION

export async function addPrinterPartToStorage(params: any){
    try{

        await connectToDatabase(); // Connect to the database

        // 1. define productNumber to know what this model is
        // 2. define white name of this part is
        // 3. 
        // 4. 

        const printer = await Makes.findOne({productNumber: params.productNumber});
        if(!printer){
            return {success: false, message: "Printer not found!"};
        } else {
          return {success: true, message: "Printer found!"};
        }


    } catch(error){
        console.error("An error occurred while adding the printer part to storage:", error);
        return {success: false, message: "An error occurred while adding the printer part to storage"};
    }
}

// My implementation ends here




export async function createParts(printerId: string, parts: { barcode: string, name: string, location: string, quantity: number }[]) {
  try {
    await connectToDatabase(); // Подключаемся к базе данных

    // Проверяем, существует ли принтер и имеет ли он name
    const printer = await Printer.findById(printerId);
    if (!printer) {
      return { success: false, message: "Printer not found!" };
    }

    if (!printer.name || printer.name.trim() === "") {
      return { success: false, message: "The printer does not have a name assigned. Parts cannot be added." };
    }

    // Валидация данных перед вставкой
    if (!Array.isArray(parts) || parts.length === 0) {
      return { success: false, message: "No parts provided" };
    }

    // Проверяем существование каждой запчасти для данного принтера по имени принтера и запчасти
    const validatedParts = [];
    for (const part of parts) {
      const existingPart = await Parts.findOne({ name: part.name, barcode: part.barcode });
      
      if (existingPart) {
        // Если запчасть существует, обновляем количество
        await Parts.updateOne({ _id: existingPart._id }, { $inc: { quantity: part.quantity } });
      } else {
        // Если запчасть не найдена, добавляем её в массив для создания
        validatedParts.push(part);
      }
    }

    // Если есть валидные запчасти, добавляем их
    if (validatedParts.length > 0) {
      await Parts.insertMany(validatedParts);
    }

    return { success: true, message: "Parts added or updated successfully" };
  } catch (error) {
    console.error("Error creating parts:", error);
    return { success: false, message: "Error creating parts" };
  }
}




export async function createPrinterPart(params: CreatePartParams){
  try{
    connectToDatabase(); // Connect to the database
    
    const {
      // printerName, 
      productNumber
    } = params;

    const existingPart = await Parts.findOne({ productNumber});
    
    if(existingPart){
      return {success: false, message: "Part's model already exists"};
    }else{
      // create part with such printerProductNumber
      const newPart = await Parts.create({
        productNumber,
      });
    }

    const exestingPrinter = await Makes.findOne({productNumber: productNumber});

    if(exestingPrinter){
      const newPart = await Parts.findOneAndUpdate(
        {productNumber}, 
        {printerName: exestingPrinter.name});
    }

    return {success: true, message: "Part created successfully"};

  }catch(error){
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return { success: false, message: "An error occurred while creating the part" };
  }
}

export async function getPartById(params: any){
  try{
    connectToDatabase(); // Connect to the database

    const {_id} = params;

    const part = await Parts.find({_id: _id}).lean();
    if(!part){
      return {success: false, message: "Part not found!"};
    }
    
    return part;

  }catch(error){
    console.error("An error occurred while getting the part:", error);
    return {success: false, message: "An error occurred while getting the part"};
  }
}

export async function assignName(params:any){
  try{
    connectToDatabase(); // Connect to the database

    const {_id, name} = params;

    const part = await Parts.findById(_id);

    if(!part){
      return {success: false, message: "Part not found!"};
    }

    // Make model to be checked if it exists
    
    const partName = await Parts.findOneAndUpdate(
      {_id}, 
      {printerName: name},
      {new: true}
    );

    if(!partName){
      return {success: false, message: "Part name not assigned!"};
    }

    const makeName = await Makes.findOneAndUpdate({productNumber: part.printerProductNumber }, { name: name  });
    if(!makeName){
      return {success: false, message: "Make name not assigned! No printers with such product number"};
    }

    const printersNames = await Printer.updateMany(
      { productNumber: part.printerProductNumber }, 
      { $set: { name: name }}
    );


    return {success: true, message: "Part name assigned successfully"};

  }catch(error){
    console.error("An error occurred while assigning the name to the part:", error);
    return {success: false, message: "An error occurred while assigning the name to the part"};
  }
}

export async function deletePrinterPart(params: any){
  try{
    connectToDatabase(); // Connect to the database

    const {_id} = params;

    const part = await Parts.findOne({_id:_id});
    if(!part){
      return {success: false, message: "Part not found!"};
    }

    if(part.parts && part.parts.length > 0){
      return { success: false, message: "Parts can't be deleted!", info: "Check if the printer's part has parts inside"}; 
    }

    await Parts.deleteOne({ _id: _id });

  } catch(error){
    console.error("An error occurred while assigning the name to the part:", error);
    return {success: false, message: "An error occurred while assigning the name to the part"};
  }
}

export async function takeOffPart(params:any){
  try{
    connectToDatabase(); // Connect to the database

    const {_id, productNumber} = params;

    const part = await Parts.findOne({printerProductNumber: productNumber});
    if(!part){
      return {success: false, message: "Part model not found!"};
    }

    if(part.parts && part.parts.length > 0){
      return { success: false, message: "Parts can't be taken off!", info: "Check if the printer's part has parts inside"}; 
    }

    await Parts.deleteOne({ _id: _id });

  }catch(error){
    console.error("An error occurred while taking off the part:", error);
    return {success: false, message: "An error occurred while taking off the part"};
  }
}

export async function addGenericPart(data: {
  barcode: string;
  location: string;
  addedAt: Date;
  printerId?: string; // опциональный ID принтера
}) {
  try {
    await connectToDatabase();

    const { barcode, location, addedAt, printerId } = data;

    // Проверка обязательных полей
    if (!barcode || !location) {
      console.error("Barcode and location are required fields.");
      return { success: false, message: "Barcode and location are required." };
    }

    // Формируем документ с опциональным полем printer
    const newPartData = {
      barcode,
      location,
      addedAt,
      ...(printerId ? { printer: new Types.ObjectId(printerId) } : {}), // если printerId передан, добавляем его в документ
    };

    // Добавляем деталь в коллекцию GenericParts
    const newPart = new GenericPart(newPartData);
    await newPart.save();

    console.log("Added generic part:", newPart);

    return { success: true, message: "Part added successfully", part: newPart };
  } catch (error) {
    console.error("Error adding generic part:", error);
    return { success: false, message: "An error occurred while adding part" };
  }
}

export async function addOrRemovePartLocation(printerProductNumber: string, partLocation: string, action: boolean) {
  try {
    await connectToDatabase(); // Подключение к базе данных

    const existingPart = await Parts.findOne({ printerProductNumber });

    if (!existingPart) {
      return { success: false, message: `Printer with product number ${printerProductNumber} not found.` };
    }

    if (action) {
      // Добавляем новую категорию, если она не существует
      if (!existingPart.parts.has(partLocation)) {
        existingPart.parts.set(partLocation, { maxParts: 10, items: [] });
        await existingPart.save();
        return { success: true, message: `${partLocation} added successfully` };
      } else {
        return { success: false, message: `${partLocation} already exists` };
      }
    } else {
      // Проверяем, существует ли категория, и если да, пуст ли массив `items`
      const location = existingPart.parts.get(partLocation);
      if (location && Array.isArray(location.items) && location.items.length === 0) {
        existingPart.parts.delete(partLocation); // Удаляем категорию
        await existingPart.save();
        return { success: true, message: `${partLocation} removed successfully` };
      } else {
        return { success: false, message: `Part location contains parts and was not removed` };
      }
    }
  } catch (error) {
    console.error("Error updating part location:", error);
    return { success: false, message: "An error occurred while updating part location" };
  }
}

export async function updatePartCategoryLimit(printerProductNumber: string, partLocation: string, newLimit: number) {
  try {
    await connectToDatabase(); 

    const existingPart = await Parts.findOne({ printerProductNumber });

    if (!existingPart) {
      return { success: false, message: `Printer with product number ${printerProductNumber} not found` };
    }

    if (!existingPart.parts[partLocation]) {
      existingPart.parts[partLocation] = { maxParts: newLimit, items: [] };
    } else {
      existingPart.parts[partLocation].maxParts = newLimit;
    }

    // Принудительное обновление части с помощью $set
    const updateResult = await Parts.findOneAndUpdate(
      { printerProductNumber },
      { $set: { [`parts.${partLocation}.maxParts`]: newLimit } },
      { new: true }
    );

    if (!updateResult) {
      return { success: false, message: `Failed to update ${partLocation} limit` };
    }

    return { success: true, message: `Limit for ${partLocation} set to ${newLimit}` };

  } catch (error) {
    console.error("An error occurred while updating max parts limit:", error);
    return { success: false, message: "An error occurred while updating max parts limit" };
  }
}

export async function addPartToLocation(data: {
  printerId: string;
  printerProductNumber: string;
  partName: string;
  barcode?: string;
  location?: string;
  createdOn: Date;
}) {
  try {
    await connectToDatabase();

    const { printerId, printerProductNumber, partName, barcode, location, createdOn } = data;

    // Проверка обязательных данных
    if (!printerProductNumber || !partName || !printerId) {
      console.error("Missing required data fields.");
      return { success: false, message: "Required data is missing" };
    }

    // Инициализация документа, если он не существует
    const existingPart = await Parts.findOneAndUpdate(
      { printerProductNumber },
      {
        $setOnInsert: { parts: new Map() }, // инициализируем пустую карту, если документа нет
      },
      { new: true, upsert: true }
    );

    // Проверяем, существует ли массив для partName в parts
    if (!existingPart.parts.has(partName)) {
      existingPart.parts.set(partName, { items: [], maxParts: 10 }); // инициализируем объект с пустым массивом items и maxParts
    }

    // Добавляем новую запчасть в items для partName
    const updateResult = await Parts.updateOne(
      { _id: existingPart._id, [`parts.${partName}.items`]: { $exists: true } },
      {
        $push: {
          [`parts.${partName}.items`]: {
            barcode,
            location,
            addedAt: createdOn,
            printer: new Types.ObjectId(printerId),
          },
        },
      }
    );

    console.log("Database update result:", updateResult);

    return { success: true, message: "Part added successfully" };
  } catch (error) {
    console.error("Error adding part:", error);
    return { success: false, message: "An error occurred while adding part" };
  }
}


