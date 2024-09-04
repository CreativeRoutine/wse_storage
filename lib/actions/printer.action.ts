"use server"

import { connectToDatabase } from "../mongoose";
import {  CreatePrinterParams,GetPrinterByBarcodeParams, FindPrinterParams, AddPrinterToPalletParams, updatePrinterPONParams, GetPrintersParams, GetPrinterParams, GetPrinterPopulatedParams, UnPinPrinterParams, DeletePrinterParams, PinToPalletParams } from "./shared.types";
import Printer from "@/database/printer.model";
import { revalidatePath } from "next/cache";
import moment from 'moment-timezone';
import Pallet from "@/database/pallet.model";
import Supplier from "@/database/supplier.model";
import Makes from "@/database/makes.model";
import { FilterQuery } from "mongoose";
import mongoose from 'mongoose';
import User from '@/database/user.model';
import Employee from "@/database/employee.model";

// Messaging ready
export async function createPrinter(params: CreatePrinterParams) {
    
  try {
      await connectToDatabase(); // Добавьте await, чтобы дождаться подключения к базе данных
      const { ponumber, sn, productNumber, barcode, path, createdOn } = params;

      // Searching if printer exists
      const existingPrinter = await Printer.findOne({ sn, barcode });
      if (existingPrinter) {
        return { success: false, message: "Printer already exests!"}; 
      }

      let printerModel;

      const printerMake = await Makes.findOne({ productNumber: productNumber });  

      if(printerMake){
        printerModel = printerMake.name;
      } else 
        {
          printerModel = "";
        }

      // Создание нового принтера
      const newPrinter = await Printer.create({
        ponumber,
        sn, 
        productNumber, 
        barcode,
        createdOn,
        name: printerModel,
      });


      // Обновляем существующего поставщика
      await Supplier.findOneAndUpdate(
        { ponumber: ponumber },
        { $push: { printers: newPrinter._id } },
        { new: true, upsert: true },
      );

      // Обновляем или создаем запись в Makes
      await Makes.findOneAndUpdate(
        { productNumber: productNumber },
        { $push: { printers: newPrinter._id } },
        { new: true, upsert: true, setDefaultsOnInsert: true },
      );

      revalidatePath(path);

      // Преобразование нового принтера в простой JavaScript объект
      const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));
    
      // return newPrinterPlain;
      return { success: true, message: "Printer addet to pallet successfully!"}; 
  } catch (error) {
    
    console.error("An error occurred while creating the printer:", error);
    return "An error occurred while creating the printer";
  }
}

// find printer for tech/cleaner' form
export async function findPrinter(params: FindPrinterParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { barcode } = params;
    if (!barcode) {
      return { success: false, message: "Barcode is required!" }; 
    }

    // Find the printer by barcode
    const result = await Printer.findOne({ barcode }).lean();

    if (!result) {
      return { success: false, message: "Printer not found!" };
    }

    // Convert the result to a plain object if necessary
    const printer = JSON.parse(JSON.stringify(result));

    return { success: true, message: "Printer was found", printer }; 

  } catch (error) {
    throw error;
  }
}

// function - to delete
export async function getPrinterByBarcode(params: GetPrinterByBarcodeParams){
  try {
    // Connect to the database
    await connectToDatabase();

    const {barcode, path} = params;

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printer = await Printer.find({barcode}).lean()

    // .populate({path: 'pallet', model: Pallet, select: "barcode location"}).lean()
    // .populate({path: "supplier", model: Supplier})
    // //.populate({path: 'author', model: User}) 
    const toPass = JSON.stringify(printer)

    return {toPass}

  } catch (error) {
    
    throw error;
  }
}

// Messaging ready
export async function addPrinterToPallet(params: AddPrinterToPalletParams) {
  
  try {
    connectToDatabase();

    const { sn, productNumber, barcode, palletId, path } = params;

    const createdOn = moment().tz("America/Chicago").toDate();
    createdOn.setHours(createdOn.getHours() - 5); 

    // Search for an existing printer by serial number, product number, and barcode
    // const existingPrinter = await Printer.findOne({ sn, productNumber, barcode });
    const existingPrinter = await Printer.findOne({ sn, barcode });
    if (existingPrinter) {
      return { success: false, message: "Printer already exests!"}; 

    }

    // Searching for a pallet by barcode
    const pallet = await Pallet.findOne({ _id: palletId });
    if (!pallet) {
      return { success: false, message: "Pallet not found"}; 
    }

    let printerModel;

    const printerMake = await Makes.findOne({ productNumber: productNumber });  

      if(printerMake){
        printerModel = printerMake.name;

      } else {
        printerModel = "";
      }
      // Creating a new printer with the _id of the pallet
      const newPrinter = await Printer.create({
        sn, 
        productNumber, 
        barcode,
        pallet: pallet._id, // Используем _id найденного паллета
        createdOn,
        ponumber: pallet.ponumber,
        name: printerModel,
      });


    // Afer creating a new printer, we add it to the pallet
    await Pallet.findByIdAndUpdate(pallet._id, { $push: { printers: newPrinter._id } });

    // Используем _id нового палета для добавления в массив pallets поставщика
    const supplier = await Supplier.findOneAndUpdate(
      { ponumber: pallet.ponumber },
      { 
        // $set: { ponumber: pallet.ponumber }, 
        // Add pallet _id
        $push: { printers: newPrinter._id } 
      }, 
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
    
    // return newPrinterPlain;
    return { success: true, message: "Printer addet to pallet successfully!"}; 
    
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return false;
  }
}

// receiving all printers with filters
export async function getPrinters(params: GetPrintersParams){
  try {
    // Connect to the database
    await connectToDatabase();

    const {searchQuery, filter, from, to, page = 1, pageSize} = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Printer> = {};

    if(searchQuery){
      query.$or = [
        {productNumber: {$regex: new RegExp(searchQuery, "i")}},
        {barcode: {$regex: new RegExp(searchQuery, "i")}},
        {ponumber: {$regex: new RegExp(searchQuery, "i")}},
        {sn: {$regex: new RegExp(searchQuery, "i")}},
        {name: {$regex: new RegExp(searchQuery, "i")}},
      ];
    }

    if (from && to) {
      query.createdOn = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = {createdOn: -1};
        break;
      case "oldest":
        sortOptions = {createdOn: 1};
        break;
      
      default:
        sortOptions = {createdOn: -1};
        break

    }

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printers = await Printer.find(query)
    .skip(skipAmount)
    .limit(pageSize)
    .sort(sortOptions)
    .lean()
    // .populate({path: 'makes', model: Makes, select: 'productNumber'})
    // .populate({path: "makes", model: Makes, select: "productNumber"})
    // .populate({path: "pallets", model: Pallet})
    // //.populate({path: 'author', model: User}) 

    const totalPrinters = await Printer.countDocuments(query);
    const isNext = totalPrinters > skipAmount + printers.length

    let total = totalPrinters / pageSize;

    return{printers, isNext, total, totalPrinters}

  } catch (error) {
    
    throw error;
  }
}

// Used on Printer's page
export async function getPrinterPopulated(params: GetPrinterPopulatedParams){
  try {
    // Connect to the database
    await connectToDatabase();

    const {_id, path} = params;

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printer = await Printer.find({_id: _id})

    .populate({path: 'pallet', model: Pallet, select: "barcode location"})
    .populate({ path: 'tasksPerformed.user', model: 'Employee', select: '_id name lastName' }) // Пополняем tasksPerformed.user
      .lean();

    return printer[0]

  } catch (error) {
    
    throw error;
  }
}


// Messaging ready
export async function updatePrinterWithCheck(params: any) {
  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    const {
      date,
      printerId,
      selectedUser,
      overallCondition,
      cleanliness,
      workable,
      changedParts,
      afterRefurbish,
      pagesNumber,
      tested,
      timeSpent,
      path
    } = params;

    // Находим принтер по ID
    const printer = await Printer.findOne({ _id: printerId });
    if (!printer) {
      return { success: false, message: "Printer not found!" };
    }

    // Находим пользователя по ID
    const user = await Employee.findOne({ _id: selectedUser.id });
    if (!user) {
      return { success: false, message: "User not found!" };
    }

    // Инициализируем массив tasksPerformed, если он отсутствует
    if (!printer.tasksPerformed) {
      printer.tasksPerformed = [];
    }

    // Создаем новый объект, который будет добавлен в массив tasksPerformed
    const newTask = {
      date: date || new Date(), // Используем переданную дату или текущую
      user: user._id,
      overallCondition,
      cleanliness,
      workable: workable === "Workable",
      repariable: workable !== "Not Repairable",
      changedParts,
      afterRefurbish,
      pagesNumber,
      tested,
      timeSpent,
    };

    // Добавляем новый объект в массив tasksPerformed
    printer.tasksPerformed.push(newTask);

    // Сохраняем изменения в принтере
    // Сохраняем изменения в принтере
    const savedPrinter = await printer.save();

    // Проверка, что данные действительно сохранились
    console.log('Saved Printer:', savedPrinter.tasksPerformed);

    // Обновляем кеш страницы
    revalidatePath(path);

    return { success: true, message: "Printer updated successfully!" };

  } catch (error) {
    console.log(error);
    throw error;
  }
}


// Messaging ready
export async function updatePrinterPON(params:updatePrinterPONParams){
  try {
    connectToDatabase();
    const { _id, ponumber, path} = params;

    const printer = await Printer.findOne({ _id: _id });
    if (!printer) {
      return { success: false, message: "Printer not found!"}; 
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
    return true
  } catch (error) {
      console.log("Error:", error);
      return false
  }

}

// Messaging ready / Dialog Alert implemented
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

    return { success: true, message: "Printer deleted successfully!"}; 

  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return { success: false, message: "Something gone wrong!", info: "Ask for help!"}; 
  }
}

// Messaging ready
export async function unPinPrinter(params:UnPinPrinterParams) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { id, printerId, path } = params;

    // clean pallet from printer
    const pallet = await Pallet.findOne({_id: id})
    
    await Pallet.findByIdAndUpdate(
      id, 
      { $pull: { printers: printerId } },
      { new: true }
    )

    // clean printer from pallet
    const printer = await Printer.find({_id: printerId})
    await Printer.findByIdAndUpdate(
      printerId, 
      { $unset: { pallet: "", ponumber:"" } },
      { new: true }
    )


    const supplier = await Supplier.findOneAndUpdate(
      { ponumber: pallet.ponumber },
      { $pull: { printers: printerId } }, // Добавляем _id палета
      //{ new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    );
    
    // Revalidate the path
    revalidatePath(path);

    return { success: true, message: "Printer unpinned successfully!"}; 

  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return { success: false, message: "Printer can't be unpinned!"}; 
  }
}

// Messaging ready
export async function PinPrinterToPallet(params:PinToPalletParams) {
  try {
    // Connect to the database
    await connectToDatabase();
    const { id, palletBarcode, path } = params;

    const pallet = await Pallet.findOne({barcode: palletBarcode});
    if (!pallet) {
      return { success: false, message: "Pallet not exist!", info:"This pallet not exist in our database."}; 
    }
    const printer = await Printer.findOne({_id: id});
    
    await Printer.findByIdAndUpdate(printer._id, { $set: { pallet: pallet._id } });
    await Pallet.findByIdAndUpdate(pallet._id, { $push: { printers: printer._id } });


    // Revalidate the path
    revalidatePath(path);

    return { success: true, message: "Printer pinned to pallet successfully!"}; 
  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return { success: false, message: "Pallet not exist!", info:"advanced help needed!"}; 
  }
}