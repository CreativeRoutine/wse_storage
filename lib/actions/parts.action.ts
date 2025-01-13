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



// My own code NEW FUNCTIONS
// 
// Проделать весь путь с начала создания принтера и проверить 
//   1. создаются ли парты
//   2. присваиваются ли имена при сизменении имен принтера...
// 
// 

export async function createPrinterPart(params: CreatePartParams){
  try{
    connectToDatabase(); // Connect to the database
    
    const { productNumber, make} = params;

    const existingPart = await Parts.findOne({ productNumber: productNumber });
    
    if(existingPart){
      return {success: false, message: "Part's model already exists"};
    }
    // create part with such productNumber
    const newPart = await Parts.create({
      productNumber: productNumber,
      printerName: make,
      partName: "",
      maxParts: 10, 
      parts: []
    });

      newPart.save();
    

    const exestingPrinter = await Makes.findOne({productNumber: productNumber});

    if(!exestingPrinter){
      // Create new printer with _id of the pallet
      const newMake = await Makes.create({
        productNumber: productNumber,
        name: make, 
      });
    }

    return {success: true, message: "Part created successfully"};

  }catch(error){
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return { success: false, message: "An error occurred while creating the part" };
  }
}

// Add part model to collection of parts
export async function addPartModelToCollection (printerPN:string, label:string, checked:boolean){
  try{
    connectToDatabase(); // Connect to the database

    const partModel = await Parts.findOne({ productNumber: printerPN });

    if(partModel){
      if(partModel.parts.length > 0){

        const existingPart = partModel.parts.find((part:any) => part.partsName === label);
        if(!existingPart){
          partModel.parts.push(
            {
              partsName: label,
              maxParts: 10, 
              part: []
            }
          )
          await partModel.save();
          return { success: true, message: "Part category added." };
        }
      } else {
        partModel.parts.push(
          {
            partsName: label,
            maxParts: 10, 
            part: []
          }
        )
        await partModel.save();
        return { success: true, message: "First part category added." };
      }



      return { success: true, message: "Part name added to parts model" };
    } else {

      // const existingPrinter = await Makes.findOne({productNumber: printerPN});

      // let makeName = "";
      // if(existingPrinter && existingPrinter.name){
      //   makeName = existingPrinter.name
      // }

      
      return { success: true, message: "Part model created and named" };
    }
  }catch(error){
    console.error("An error occurred while creating the printer:", error);
    return { success: false, message: "An error occurred while creating the part" };
  }
}

// Delete part model from collection of parts if parts are empty
export async function deletePartModelFromCollection(printerPN: string, label: string) {
  try {
    connectToDatabase(); // Подключаемся к базе данных

    // Находим модель запчастей по `productNumber`
    const partModel = await Parts.findOne({ productNumber: printerPN });

    if (!partModel) {
      return { success: false, message: "Part model not found." };
    }

    console.log("DELETE ====>", partModel);

    // Найдём секцию с указанным `partsName`
    const partSection = partModel.parts.find((part: any) => part.partsName === label);

    if (!partSection) {
      return { success: false, message: "Part section not found in model." };
    }

    // Проверяем, пуст ли массив `part`
    if (partSection.part.length > 0) {
      return { success: false, message: "Cannot delete part section: part array is not empty." };
    }

    // Удаляем секцию, если массив `part` пуст
    partModel.parts = partModel.parts.filter((part: any) => part.partsName !== label);

    // Сохраняем изменения
    await partModel.save();

    return { success: true, message: "Part section successfully deleted." };
  } catch (error) {
    console.error("An error occurred while deleting the part section:", error);
    return { success: false, message: "An error occurred while deleting the part section." };
  }
}

// Adding part's qtyy
export async function updatePartCategoryLimit(productNumber: string, label: string, newLimit: number) {
  try {
    await connectToDatabase(); 

    // Находим документ по productNumber
    const existingPart = await Parts.findOne({ productNumber });

    if (!existingPart) {
      return { success: false, message: `Printer with product number ${productNumber} not found` };
    }

    // Ищем в массиве parts объект с partsName, равным label
    const partToUpdate = existingPart.parts.find((part: any) => part.partsName === label);

    if (!partToUpdate) {
      return { success: false, message: `Part category with name ${label} not found` };
    }

    // Обновляем maxParts
    partToUpdate.maxParts = newLimit;

    // Сохраняем изменения в документе
    await existingPart.save();

    return { success: true, message: `Limit for ${label} set to ${newLimit}` };
  } catch (error) {
    console.error("An error occurred while updating max parts limit:", error);
    return { success: false, message: "An error occurred while updating max parts limit" };
  }
}

export async function getAllPartsSimple() {
  try {
    // Connect to the database
    connectToDatabase();

    const allParts = await Parts.find({}).lean();

    return (allParts);
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}

export async function getAllParts(params: GetAllPartsParams) {
  try {
    // Connect to the database
    connectToDatabase();

    const {searchQuery} = params;

    const query: FilterQuery<typeof Parts> = {};

    if(searchQuery){
      query.$or = [
        {printerName: {$regex: new RegExp(searchQuery, "i")}},
        {productNumber: {$regex: new RegExp(searchQuery, "i")}},
      ];
    }

    // Searching if printer exists
    const allParts = await Parts.find(query).sort({ field: -1 });
    if (!allParts) {
      return "There are NO makes in the database";
    }

    return (allParts);
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}

export async function getPartsById(params: any){
  try{
    connectToDatabase(); // Connect to the database

    const {_id} = params;

    const part = await Parts.findOne({_id: _id})

    if(!part){
      return {success: false, message: "Parts for this printer not found!"};
    }
    const partPN = part.productNumber;

    const allParts = await Parts.find({productNumber: partPN}).lean();

    return allParts;

  }catch(error){
    console.error("An error occurred while getting the part:", error);
    return {success: false, message: "An error occurred while getting the part"};
  }
}

export async function getPartsByProductNumber(params: any) {
  try {
    const { productNumber } = params;
    
    console.log(productNumber)
    
    if (!productNumber) {
      return { success: false, message: "Product number not found" };
    } 
    
    connectToDatabase();

    const partsResponse = await Parts.findOne({ productNumber }).lean();
    
    return partsResponse; // Возвращаем объект напрямую
  } catch (error) {
    console.error("An error occurred while getting the part:", error);
    return { success: false, message: "An error occurred while getting the part" };
  }
}

export async function addPartFromStorage(params: any) {
  try {
    const { productNumber, partName, barcode } = params;

    if (!productNumber) {
      return { success: false, message: "Product number not found" };
    }

    connectToDatabase();

    // Найти детали по productNumber
    const response: any = await Parts.findOne({ productNumber: productNumber }).lean();
    if (!response) {
      return { success: false, message: "Parts not found. Check Barcode." };
    }

    // Найти нужную деталь по partsName
    const matchingPart = response.parts.find((part: any) => part.partsName === partName);
    if (!matchingPart) {
      return { success: false, message: `Part with name "${partName}" not found.` };
    }

    console.log("Matching Part:", matchingPart);

    // Найти нужный элемент в массиве part по barcode
    const partToRemoveIndex = matchingPart.part.findIndex((p: any) => p.barcode === barcode);

    if (partToRemoveIndex === -1) {
      return { success: false, message: `Part with barcode "${barcode}" not found.` };
    }

    // Удалить элемент из массива part
    matchingPart.part.splice(partToRemoveIndex, 1);

    // Обновить запись в базе данных
    await Parts.updateOne(
      { productNumber: productNumber, "parts.partsName": partName },
      { $set: { "parts.$.part": matchingPart.part } }
    );

    console.log("Updated Part List:", matchingPart.part);

    return { success: true, message: "Part removed from storage." };
  } catch (error) {
    console.error("An error occurred while getting the part:", error);
    return { success: false, message: "An error occurred while getting the part" };
  }
}

export async function getPartsByProductNumberPlain(params: any) {
  try {
    const { productNumber } = params;

    if (!productNumber) throw new Error("Product number is missing");

    connectToDatabase();

    const partsResponse = await Parts.findOne({ productNumber }).lean();

    console.log("DISPL PARTS DATA?? ",partsResponse)

    if (!partsResponse) {
      return { success: false, message: "No parts found" };
    }

    // Преобразуем объект в plain object
    const plainObject = JSON.parse(
      JSON.stringify(partsResponse, (key, value) => {
        if (value && value._bsontype === "ObjectId") return value.toString(); // Конвертируем ObjectId в строку
        if (value && Buffer.isBuffer(value)) return value.toString("base64"); // Конвертируем Buffer в строку
        return value;
      })
    );

    return plainObject; // Возвращаем преобразованный объект
  } catch (error) {
    console.error("An error occurred while getting the part:", error);
    return { success: false, message: "An error occurred while getting the part" };
  }
}

export async function addGenericPart(data: {
  barcode: string;
  location: string;
  createdOn: Date;
  partName: string;
  productNumber: string;
  printerId?: string; // Опциональный ID принтера
  used?: boolean; // Поле used
}) {
  try {
    await connectToDatabase();

    const { barcode, location, createdOn, productNumber, printerId, used = false } = data;

    const part = await Parts.findOne({ productNumber });
    if (!part) {
      return { success: false, message: "Part not found!" };
    }

    // Проверяем, существует ли часть с таким именем
    const existingPart = part.parts.find((part: any) => part.partsName === data.partName);
    if (!existingPart) {
      return { success: false, message: "Part not found in list" };
    }

    // Проверяем лимит
    if (existingPart.part.length >= existingPart.maxParts) {
      return {
        success: false,
        message: `Cannot add part: limit of ${existingPart.maxParts} reached for ${data.partName}`,
      };
    }

    // Добавляем новую часть в массив `part`
    existingPart.part.push({
      barcode,
      location,
      addedAt: createdOn,
      printer: printerId,
      used, // Указываем значение для used
    });

    // Сохраняем изменения
    await part.save();

    return { success: true, message: "Part added successfully" };
  } catch (error) {
    console.error("Error adding generic part:", error);
    return { success: false, message: "An error occurred while adding part" };
  }
}

export async function changePartLocation(params: any) {
  try {
    await connectToDatabase();

    const { printer, partName, location, id, barcode } = params;

    // Находим часть по имени принтера
    const part = await Parts.findOne({ printerName: printer });
    if (!part) {
      return { success: false, message: "Part not found!" };
    }

    // Ищем объект в массиве `parts` с нужным `partsName`
    const partItem = part.parts.find((item: any) => item.partsName === partName);
    if (!partItem) {
      return { success: false, message: `Part with name "${partName}" not found!` };
    }

    // Ищем объект внутри массива `part` с нужным `_id`
    const subPart = partItem.part.find((item: any) => item._id.toString() === id);
    if (!subPart) {
      return { success: false, message: `Sub-part with ID "${id}" not found!` };
    }

    // Обновляем `barcode` и `location`
    subPart.barcode = barcode || subPart.barcode; // Если передан новый `barcode`
    subPart.location = location || subPart.location; // Если передан новый `location`

    // Сохраняем изменения в базе данных
    await part.save();

    return { success: true, message: "Location and barcode updated successfully!" };
  } catch (error) {
    console.error("Error updating part location:", error);
    return { success: false, message: "An error occurred while updating part location" };
  }
}

export async function addPartFromPrinter(data: { 
  createdOn: Date;
  partName: string;
  productNumber: string;
  printerId?: string; // Опциональный ID принтера
  used?: boolean; // Поле used
}) {
  try {
    await connectToDatabase();

    const { createdOn, productNumber, printerId, used = false } = data;

    const part = await Parts.findOne({ productNumber });
    if (!part) {
      return { success: false, message: "Part not found!" };
    }

    // Проверяем, существует ли часть с таким именем
    const existingPart = part.parts.find((part: any) => part.partsName === data.partName);
    if (!existingPart) {
      return { success: false, message: "Part not found in list" };
    }

    // Проверяем лимит
    if (existingPart.part.length >= existingPart.maxParts) {
      return {
        success: false,
        message: `Cannot add part: limit of ${existingPart.maxParts} reached for ${data.partName}`,
      };
    }

    // Добавляем новую часть в массив `part`
    existingPart.part.push({
      addedAt: createdOn,
      from: printerId,
      used: false, // Указываем значение для used
    });

    // Сохраняем изменения
    await part.save();

    return { success: true, message: "Part added successfully" };
  } catch (error) {
    console.error("Error adding generic part:", error);
    return { success: false, message: "An error occurred while adding part" };
  }
}

export async function addPartToPrinter(data: { 
  createdOn: Date;
  partName: string;
  productNumber: string;
  printerId?: string; // Опциональный ID принтера
  used?: boolean; // Поле used
}) {
  try {
    await connectToDatabase();

    const { createdOn, productNumber, printerId, used = false } = data;

    const part = await Parts.findOne({ productNumber });
    if (!part) {
      return { success: false, message: "Part not found!" };
    }

    // Проверяем, существует ли часть с таким именем
    const existingPart = part.parts.find((part: any) => part.partsName === data.partName);
    if (!existingPart) {
      return { success: false, message: "Part not found in list" };
    }

    // Проверяем лимит
    if (existingPart.part.length >= existingPart.maxParts) {
      return {
        success: false,
        message: `Cannot add part: limit of ${existingPart.maxParts} reached for ${data.partName}`,
      };
    }

    // Добавляем новую часть в массив `part`
    existingPart.part.push({
      addedAt: createdOn,
      from: printerId,
      used: false, // Указываем значение для used
    });

    // Сохраняем изменения
    await part.save();

    return { success: true, message: "Part added successfully" };
  } catch (error) {
    console.error("Error adding generic part:", error);
    return { success: false, message: "An error occurred while adding part" };
  }
}



export async function getAllPartsModels(params: any){
  try{
    connectToDatabase(); // Connect to the database


    const parts = await Parts.find({}).lean()

    if(!parts){
      
      return {success: false, message: "Parts for this printer not found!"};
    }
    
    
    
    // const rawParts = JSON.stringify(parts);

    return parts;

  }catch(error){
    console.error("An error occurred while getting the part:", error);
    return {success: false, message: "An error occurred while getting the part"};
  }
}


// 
// 
//  END OF MY NEW FUNCTIONS
// 
// 









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







export async function addOrRemovePartLocation(productNumber: string, label: string, action: boolean) {
  try {
    await connectToDatabase(); // Подключение к базе данных

    const existingPart = await Parts.findOne({ productNumber });

    if (!existingPart) {
      return { success: false, message: `Printer with product number ${productNumber} not found.` };
    }

    if (action) {
      // await Parts.findByIdAndUpdate(productNumber, { $push: { parts: {
      //   barcode:
      //   location:
      //   addedAt:
      //   printer:
      // } } });




      // Добавляем новую категорию, если она не существует
      if (!existingPart.parts.has(label)) {
        existingPart.parts.set(label, { maxParts: 10, items: [] });
        await existingPart.save();
        return { success: true, message: `${label} added successfully` };
      } else {
        return { success: false, message: `${label} already exists` };
      }
    } else {
      // Проверяем, существует ли категория, и если да, пуст ли массив `items`
      const location = existingPart.parts.get(label);
      if (location && Array.isArray(location.items) && location.items.length === 0) {
        existingPart.parts.delete(label); // Удаляем категорию
        await existingPart.save();
        return { success: true, message: `${label} removed successfully` };
      } else {
        return { success: false, message: `Part location contains parts and was not removed` };
      }
    }
  } catch (error) {
    console.error("Error updating part location:", error);
    return { success: false, message: "An error occurred while updating part location" };
  }
}



// parts.action.ts
// parts.action.ts
// parts.action.ts

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



// ++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// Add part to printer FOR FUTURE
//
// ++++++++++++++++++++++++++++++++++++++++++++++++++++

interface AddPartParams {
  printerProductNumber: string;
  partLocation: string; // Сторона, к которой добавляется часть (например, "Right Side")
  barcode: string;
  location: string;
  printerId: string; // ID принтера, к которому относится часть
}

export async function addPartToPrinter__UNKNOWN(params: AddPartParams) {
  try {
    await connectToDatabase(); // Подключение к базе данных

    const { printerProductNumber, partLocation, barcode, location, printerId } = params;

    // Ищем запись Parts для заданного printerProductNumber
    const existingPart = await Parts.findOne({ printerProductNumber });

    if (!existingPart) {
      // Если запись Parts для данного принтера не существует, создаём её с нужной стороной и частью
      const newPart = await Parts.create({
        printerProductNumber,
        parts: {
          [partLocation]: [
            {
              barcode,
              location,
              printer: new Types.ObjectId(printerId)
            }
          ]
        }
      });

      return { success: true, message: "New Parts record created with the part added", part: newPart };
    } else {
      // Если запись существует, добавляем новую часть к нужной стороне
      const update = {
        $push: {
          [`parts.${partLocation}`]: {
            barcode,
            location,
            printer: new Types.ObjectId(printerId)
          }
        }
      };

      await Parts.updateOne({ printerProductNumber }, update);

      return { success: true, message: "Part added to existing record" };
    }

  } catch (error) {
    console.error("An error occurred while adding the part:", error);
    return { success: false, message: "An error occurred while adding the part" };
  }
}



// ++++++++++++++++++++++++++++++++++++++++++++++++++++
//
// END, DONT TOUCH
//
// ++++++++++++++++++++++++++++++++++++++++++++++++++++





export async function addPart(barcode: string, make: string, name: string, location: string, createdOn: Date) {
  try {
    await connectToDatabase(); // Подключаемся к базе данных

    // Предполагаемое создание или обновление данных
    // Реализуйте вашу логику здесь

    return { success: true, message: "Parts added or updated successfully" };
  } catch (error) {
    console.error("An error occurred while adding part:", error);
    
    // Возвращаем ошибочный результат в случае ошибки
    return { success: false, message: "Failed to add or update part" };
  }
}

