"use server"

import { connectToDatabase } from "../mongoose";
import {  CreatePrinterParams,GetPrinterByBarcodeParams, updatePrinterPreviewParams, FindPrinterParams, FindPrinterCleanerParams, AddPrinterToPalletParams, addPrinterCommentParams, updatePrinterPONParams, GetPrintersParams, GetPrinterParams, GetPrinterPopulatedParams, UnPinPrinterParams, DeletePrinterParams, PinToPalletParams, addPrinterInvoiceNumberParams } from "./shared.types";
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
import Parts from "@/database/parts.model";
import dayjs from "dayjs";

// AFTER PARTS IMPLEMENTATION
// CONFIRMED AS WORKABLE
export async function createPrinter(params: CreatePrinterParams) {
  try {
    await connectToDatabase(); // Подключение к базе данных

    const { 
      // ponumber, 
      sn, 
      productNumber, 
      barcode, 
      path, 
      createdOn } = params;

    // Проверяем, существует ли принтер с таким же barcode
    const existingBarcode = await Printer.findOne({ barcode });
    if (existingBarcode) {
      return { success: false, message: `Printer with barcode ${barcode} already exists!` };
    }

    let printerModel = "";
    let printerPreview = "";

    // Поиск по productNumber
    const printerMake = await Makes.findOne({ productNumber });
    if (printerMake) {
      printerModel = printerMake.name || "";
      printerPreview = printerMake.preview || "";
    }

    // Проверяем, существует ли запись в Parts
    // const printerPart = await Parts.findOne({ productNumber });
    // if (!printerPart) {
    //   await Parts.create({
    //     productNumber,
    //     printerName: printerModel,
    //     parts: [],
    //   });
    // }

    // Создаем новый принтер
    const newPrinter = await Printer.create({
      // ponumber,
      sn,
      productNumber,
      barcode,
      createdOn,
      name: printerModel,
      preview: printerPreview,
    });

    // Обновляем Supplier
    // await Supplier.findOneAndUpdate(
    //   { ponumber },
    //   { $push: { printers: newPrinter._id } },
    //   { new: true, upsert: true }
    // );

    // Обновляем или создаем запись в Makes
    await Makes.findOneAndUpdate(
      { productNumber },
      { $push: { printers: newPrinter._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    revalidatePath(path);

    return { success: true, message: "Printer and parts record created successfully!" };

  } catch (error) {
    console.error("An error occurred while creating the printer:", error);
    return { success: false, message: "An error occurred while creating the printer" };
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
    const result = await Printer.findOne({ barcode })
    .populate({ path: 'tasksPerformed.user', model: 'Employee', select: '_id name lastName' })
    .lean();

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

export async function findPrinterCleaner(params: FindPrinterCleanerParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { barcode } = params;

    if (!barcode) {
      return { success: false, message: "Barcode is required!" }; 
    }

    // Find the printer by barcode
    const result = await Printer.findOne({ barcode })
    .populate({ path: 'tasksPerformed.user', model: 'Employee', select: '_id name lastName' })
    .lean();

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

export async function getPrinterById(params: any){
  try {
    // Connect to the database
    await connectToDatabase();

    const {id} = params;

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const printer = await Printer.findOne({_id: id}).lean()
    
    if(!printer){
      return console.log("PRINTER NOT FOUND")
    }

    // .populate({path: 'pallet', model: Pallet, select: "barcode location"}).lean()
    // .populate({path: "supplier", model: Supplier})
    // //.populate({path: 'author', model: User}) 
    const printerPlain = JSON.parse(JSON.stringify(printer))

    return printerPlain

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

//receiving all printers with filters
// export async function getPrinters(params: GetPrintersParams) {
//   try {
//     // Подключение к базе данных
//     await connectToDatabase();

//     const { searchQuery, filter, from, to, page = 1, pageSize } = params;

//     const skipAmount = (page - 1) * pageSize;

//     const query: FilterQuery<typeof Printer> = {};

//     if (searchQuery) {
//       query.$or = [
//         { productNumber: { $regex: new RegExp(searchQuery, "i") } },
//         { barcode: { $regex: new RegExp(searchQuery, "i") } },
//         { ponumber: { $regex: new RegExp(searchQuery, "i") } },
//         { sn: { $regex: new RegExp(searchQuery, "i") } },
//         { name: { $regex: new RegExp(searchQuery, "i") } },
//         {
//           $expr: {
//             $regexMatch: {
//               input: { $arrayElemAt: ["$tasksPerformed.status", -1] },
//               regex: new RegExp(searchQuery, "i"),
//             },
//           },
//         },
//         {
//           $expr: {
//             $regexMatch: {
//               input: {
//                 $arrayElemAt: [
//                   {
//                     $map: {
//                       input: "$tasksPerformed",
//                       as: "task",
//                       in: {
//                         $arrayElemAt: ["$$task.performedCleaner.status", -1],
//                       },
//                     },
//                   },
//                   -1,
//                 ],
//               },
//               regex: new RegExp(searchQuery, "i"),
//             },
//           },
//         },
//       ];
//     }

//     if (from && to) {
//       query.createdOn = {
//         $gte: new Date(from),
//         $lte: new Date(to),
//       };
//     }

//     let sortOptions = {};

//     switch (filter) {
//       case "newest":
//         sortOptions = { createdOn: -1 };
//         break;
//       case "oldest":
//         sortOptions = { createdOn: 1 };
//         break;

//       default:
//         sortOptions = { createdOn: -1 };
//         break;
//     }

//     // Запрос к базе данных
    // const printers = await Printer.find(query)
    //   .skip(skipAmount)
    //   .limit(pageSize)
    //   .sort(sortOptions)
    //   .lean();

    // const totalPrinters = await Printer.countDocuments(query);
    // const isNext = totalPrinters > skipAmount + printers.length;

    // let total = totalPrinters / pageSize;

    // return { printers, isNext, total, totalPrinters };
//   } catch (error) {
//     throw error;
//   }
// }

// export async function getPrinters(params: GetPrintersParams) {
//   try {
//     // Подключение к базе данных
//     await connectToDatabase();

//     const { searchQuery, filter, status, from, to, page = 1, pageSize } = params;

//     const skipAmount = (page - 1) * pageSize;

//     const query: FilterQuery<typeof Printer> = {};

//     if (searchQuery) {
//       query.$or = [
//         { productNumber: { $regex: new RegExp(searchQuery, "i") } },
//         { barcode: { $regex: new RegExp(searchQuery, "i") } },
//         { ponumber: { $regex: new RegExp(searchQuery, "i") } },
//         { sn: { $regex: new RegExp(searchQuery, "i") } },
//         { name: { $regex: new RegExp(searchQuery, "i") } },
//         {
//           $expr: {
//             $regexMatch: {
//               input: { $arrayElemAt: ["$tasksPerformed.status", -1] },
//               regex: new RegExp(searchQuery, "i"),
//             },
//           },
//         },
//         {
//           $expr: {
//             $regexMatch: {
//               input: {
//                 $arrayElemAt: [
//                   {
//                     $map: {
//                       input: "$tasksPerformed",
//                       as: "task",
//                       in: {
//                         $arrayElemAt: ["$$task.performedCleaner.status", -1],
//                       },
//                     },
//                   },
//                   -1,
//                 ],
//               },
//               regex: new RegExp(searchQuery, "i"),
//             },
//           },
//         },
//       ];
//     }

//     // Добавляем фильтр по статусу
//     if (status) {
//       query["tasksPerformed"] = {
//         $exists: true,
//         $ne: [],
//       };
//       query["tasksPerformed.status"] = { $regex: new RegExp(status, "i") };

//       query.$expr = {
//         $eq: [
//           { $arrayElemAt: ["$tasksPerformed.status", -1] }, // Берем последний элемент массива
//           status,
//         ],
//       };
//     }

//     if (from && to) {
//       query.createdOn = {
//         $gte: new Date(from),
//         $lte: new Date(to),
//       };
//     }

//     let sortOptions = {};

//     switch (filter) {
//       case "newest":
//         sortOptions = { createdOn: -1 };
//         break;
//       case "oldest":
//         sortOptions = { createdOn: 1 };
//         break;

//       default:
//         sortOptions = { createdOn: -1 };
//         break;
//     }

//     // Запрос к базе данных
//     const printers = await Printer.find(query)
//       .skip(skipAmount)
//       .limit(pageSize)
//       .sort(sortOptions)
//       .lean();

//     const totalPrinters = await Printer.countDocuments(query);
//     const isNext = totalPrinters > skipAmount + printers.length;

//     let total = totalPrinters / pageSize;

//     return { printers, isNext, total, totalPrinters };
//   } catch (error) {
//     throw error;
//   }
// }

export async function getPrinters_СТАРЫЙ_РАБОЧИЙ(params: GetPrintersParams) {
  try {
    // Подключение к базе данных
    await connectToDatabase();

    const { searchQuery, filter, from, to, page = 1, pageSize, status } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Printer> = {};

    // Фильтрация по дате
    if (from && to) {
      query.createdOn = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    // Фильтрация по другим полям
    if (searchQuery) {
      query.$or = [
        { productNumber: { $regex: new RegExp(searchQuery, "i") } },
        { barcode: { $regex: new RegExp(searchQuery, "i") } },
        { ponumber: { $regex: new RegExp(searchQuery, "i") } },
        { sn: { $regex: new RegExp(searchQuery, "i") } },
        { name: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdOn: -1 };
        break;
      case "oldest":
        sortOptions = { createdOn: 1 };
        break;
        

      default:
        sortOptions = { createdOn: -1 };
        break;
    }

    // Этап агрегации
    const aggregatedData = await Printer.aggregate([
      {
        $match: query, // Сначала фильтруем по дате
      },
      {
        $addFields: {
          lastTask: { $arrayElemAt: ["$tasksPerformed", -1] }, // Берем последний объект из tasksPerformed
        },
      },
      {
        $match: {
          "lastTask.status": status || "Refurbished", // Затем фильтруем по статусу
        },
      },
      {
        $count: "refurbishedPrinters", // Подсчитываем количество
      },
    ]);

    // Основной запрос к базе данных для остальных данных
    const printers = await Printer.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortOptions)
      .lean();

    const totalPrinters = await Printer.countDocuments(query);
    const isNext = totalPrinters > skipAmount + printers.length;

    let total = totalPrinters / pageSize;

    const refurbishedCount =
      aggregatedData.length > 0 ? aggregatedData[0].refurbishedPrinters : 0;

    return { printers, isNext, total, totalPrinters, refurbishedCount };
  } catch (error) {
    throw error;
  }
}

export async function getPrinters(params: GetPrintersParams) {
  try {
    await connectToDatabase();

    const { searchQuery, filter, from, to, page = 1, pageSize } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: any = {};

    // Фильтрация по дате
    if (from && to) {
      query.createdOn = {
        $gte: new Date(from),
        $lte: new Date(to),
      };
    }

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      query.$or = [
        { productNumber: { $regex: new RegExp(searchQuery, "i") } },
        { barcode: { $regex: new RegExp(searchQuery, "i") } },
        { ponumber: { $regex: new RegExp(searchQuery, "i") } },
        { sn: { $regex: new RegExp(searchQuery, "i") } },
        { name: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};
      switch (filter) {
        case "newest":
          sortOptions = { createdOn: -1 };
          break;
        case "oldest":
          sortOptions = { createdOn: 1 };
          break;
        default:
          sortOptions = { createdOn: -1 };
          break;
      }

    // Условие для фильтров Refurbished, Cleaned и наличия invoiceNumber
    const filterCondition = [];
    if (filter === "refurbished") {
      filterCondition.push({
        $and: [{ "lastTask.status": "Refurbished" }],
      });
    }
    if (filter === "cleaned") {
      filterCondition.push({
        $and: [
          { "lastTask.performedCleaner": { $exists: true, $not: { $size: 0 } } },
          { "lastCleaner.status": "Cleaned" },
        ],
      });
    }
    if (filter === "invoice") {
      filterCondition.push({
        $and: [
          { "lastTask.performedCleaner": { $exists: true, $not: { $size: 0 } } },
          { "lastCleaner.invoiceNumber": { $exists: true, $ne: "" } },
        ],
      });
    }

    // Агрегация для фильтрации
    const aggregationPipeline = [
      {
        $match: query, // Основная фильтрация по дате и поисковому запросу
      },
      {
        $addFields: {
          lastTask: { $arrayElemAt: ["$tasksPerformed", -1] }, // Последний объект из `tasksPerformed`
          lastCleaner: {
            $arrayElemAt: ["$tasksPerformed.performedCleaner", -1], // Последний объект из `performedCleaner`
          },
        },
      },
      {
        $match: {
          $or: filterCondition.length > 0 ? filterCondition : [{}], // Применяем фильтрацию по статусу
        },
      },
    ];

    // Выполняем фильтрацию и подсчёт общего количества принтеров
    const totalPrintersAggregation = await Printer.aggregate([...aggregationPipeline, { $count: "total" }]);
    const totalPrinters = totalPrintersAggregation.length > 0 ? totalPrintersAggregation[0].total : 0;

    // Выполняем агрегацию для получения принтеров с пагинацией и сортировкой
    const printers = await Printer.aggregate([
      ...aggregationPipeline, // Применяем ту же фильтрацию
      { $sort: sortOptions }, // Сортировка по всему набору данных
      { $skip: skipAmount },  // Пропускаем документы для пагинации
      { $limit: pageSize },   // Лимит на страницу
    ]);

    // Вычисляем количество страниц и есть ли следующая страница
    const total = Math.ceil(totalPrinters / pageSize);
    const isNext = skipAmount + printers.length < totalPrinters;

    return {
      printers,
      totalPrinters,
      total,
      isNext,
    };
  } catch (error) {
    console.error("Error fetching printers:", error);
    throw new Error("Error fetching printers");
  }
}

export async function getData() {
  try {
    await connectToDatabase();

    // Начало и конец текущего дня
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();

    // Начало и конец текущей недели
    const weekStart = dayjs().startOf("week").toDate();
    const weekEnd = dayjs().endOf("week").toDate();

    const totalPrinters = await Printer.countDocuments();
    const totalPallets = await Pallet.countDocuments();

    // Принтеры refurbished (состояние "Refurbished") за день
    const refurbishedToday = await Printer.countDocuments({
      "tasksPerformed.date": { $gte: todayStart, $lte: todayEnd },
      "tasksPerformed.status": "Refurbished",
    });

    // Принтеры refurbished за неделю
    const refurbishedThisWeek = await Printer.countDocuments({
      "tasksPerformed.date": { $gte: weekStart, $lte: weekEnd },
      "tasksPerformed.status": "Refurbished",
    });

    // Принтеры cleaned за день
    const cleanedToday = await Printer.countDocuments({
      "tasksPerformed.performedCleaner.date": { $gte: todayStart, $lte: todayEnd },
    });

    // Принтеры cleaned за неделю
    const cleanedThisWeek = await Printer.countDocuments({
      "tasksPerformed.performedCleaner.date": { $gte: weekStart, $lte: weekEnd },
    });

    return {
      totalPrinters,
      totalPallets,
      refurbishedToday,
      refurbishedThisWeek,
      cleanedToday,
      cleanedThisWeek,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data");
  }
}



// Used on Printer's page
// export async function getPrinterPopulated(params: GetPrinterPopulatedParams){
//   try {
//     // Connect to the database
//     await connectToDatabase();

//     const {_id, path} = params;

//     // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
//     const printer = await Printer.find({_id: _id})
//     .populate({path: 'pallet.printers', model: 'Pallet', select: "barcode location"})
//     .populate({ path: 'tasksPerformed.user', model: 'Employee', select: '_id name lastName' }) // Пополняем tasksPerformed.user
//     .populate({
//       path: 'tasksPerformed.performedCleaner.user',
//       model: 'Employee',
//       select: '_id name',
//     })
//       .lean();
      

//     return printer[0]

//   } catch (error) {
    
//     throw error;
//   }
// }

export async function getPrinterPopulated(params: GetPrinterPopulatedParams) {
  try {
    // Подключение к базе данных
    await connectToDatabase();

    const { _id, path } = params;

    // Находим принтер и пополняем нужные данные
    const printer = await Printer.findOne({ _id: _id })
      .populate({ path: 'pallet', model: 'Pallet', select: 'barcode location' }) // Пополняем pallet, выбирая barcode и location
      .populate({ path: 'tasksPerformed.user', model: 'Employee', select: '_id name lastName' }) // Пополняем tasksPerformed.user
      .populate({
        path: 'tasksPerformed.performedCleaner.user',
        model: 'Employee',
        select: '_id name',
      })
      .lean();

    if (!printer) {
      throw new Error("Printer not found");
    }

    return printer;

  } catch (error) {
    console.error("Error fetching populated printer:", error);
    throw error;
  }
}



// Messaging ready
// FORM FOR TECHNICIAN
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
      additionalInfo,
      status,
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

    // Проверяем, существует ли массив printers, если нет — создаем
    if (!user.printers) {
      user.printers = [];
    }

    // Добавляем объект с данными (printerId, timeSpent, date) в массив printers
    user.printers.push({
      printerId: printerId,
      timeSpent,
      date: date || new Date(), // Если дата не передана, используем текущую
    });

    // Сохраняем изменения в пользователе
    await user.save();


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
      status,
      additionalInfo,
    };

    // Добавляем новый объект в массив tasksPerformed
    printer.tasksPerformed.push(newTask);

    // Сохраняем изменения в принтере
    // Сохраняем изменения в принтере
    const savedPrinter = await printer.save();

    // Проверка, что данные действительно сохранились
    // console.log('Saved Printer:', savedPrinter.tasksPerformed);

    // Обновляем кеш страницы
    revalidatePath(path);

    return { success: true, message: "Printer updated successfully!" };

  } catch (error) {
    console.log(error);
    throw error;
  }
}

// Messaging ready
// FORM FOR CLEANER
export async function updatePrinterWithCheckCleaner(params: any) {
  try {
    await connectToDatabase();

    const {
      date,
      printerId,
      selectedUser,
      overallCondition,
      cleanliness,
      afterRefurbish,
      additionalInfo,
      timeSpent,
      status,
      testedAfterCleaning,
      invoiceNumber,
      path,
    } = params;

    // Находим принтер по ID
    const printer = await Printer.findOne({ _id: printerId });
    if (!printer) {
      return { success: false, message: "Printer not found!" };
    }

    // Проверяем, есть ли массив tasksPerformed
    if (!printer.tasksPerformed || printer.tasksPerformed.length === 0) {
      return { success: false, message: "No tasks performed to update." };
    }

    // Находим пользователя по ID
    const user = await Employee.findOne({ _id: selectedUser.id });
    if (!user) {
      return { success: false, message: "User not found!" };
    }

    // Проверяем, существует ли массив printers, если нет — создаем
    if (!user.printers) {
      user.printers = [];
    }

    // Добавляем объект с данными (printerId, timeSpent, date) в массив printers
    user.printers.push({
      printerId: printerId,
      timeSpent,
      date: date || new Date(), // Если дата не передана, используем текущую
    });

    // Сохраняем изменения в пользователе
    await user.save();

    // Получаем последний объект в массиве tasksPerformed
    const lastTaskIndex = printer.tasksPerformed.length - 1;
    const lastTask = printer.tasksPerformed[lastTaskIndex];

    // Инициализируем поле performedCleaner, если оно отсутствует
    if (!lastTask.performedCleaner) {
      lastTask.performedCleaner = [];
    }

    // Добавляем новую запись в массив performedCleaner
    lastTask.performedCleaner.push({
      date: date || new Date(),
      user: user._id,
      overallCondition: overallCondition || "Default Condition",
      cleanliness: cleanliness || "Default Cleanliness",
      afterRefurbish: afterRefurbish || "Default Refurbish Status",
      timeSpent: timeSpent || 0,
      status: status || "Pending",
      additionalInfo: additionalInfo || "No additional info",
      invoiceNumber: invoiceNumber || "No invoice number",
      tested: testedAfterCleaning
    });

    // Сохраняем изменения в принтере
    printer.markModified(`tasksPerformed.${lastTaskIndex}.performedCleaner`);
    const savedPrinter = await printer.save();

    // Обновляем кеш страницы
    revalidatePath(path);

    return { success: true, message: "PerformedCleaner updated successfully!" };
  } catch (error) {
    console.error("Error during update:", error);
    return { success: false, message: "An error occurred while updating the printer." };
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

export async function addPrinterComment(params: addPrinterCommentParams) {
  try {
    connectToDatabase();
    const { _id, comment, path } = params;

    const printer = await Printer.findOne({ _id: _id });
    if (!printer) {
      return { success: false, message: "Printer not found!" };
    }

    const lastTask = printer.tasksPerformed?.at(-1);
    if (!lastTask) {
      return { success: false, message: "No tasks performed found!" };
    }

    // Добавляем комментарий к последнему объекту
    lastTask.comment = comment;

    // Сохраняем изменения в базе данных
    await printer.save();

    console.log("Updated last task:", lastTask);

    revalidatePath(path);

    return { success: true};

  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function addPrinterInvoiceNumber(params: addPrinterInvoiceNumberParams) {
  try {
    connectToDatabase();
    const { _id, invoiceNumber, path } = params;

    // Найти принтер по ID
    const printer = await Printer.findOne({ _id: _id });
    if (!printer) {
      return { success: false, message: "Printer not found!" };
    }

    // Получить последний объект из tasksPerformed
    const lastTask = printer.tasksPerformed?.at(-1);
    if (!lastTask) {
      return { success: false, message: "No tasks performed found!" };
    }

    // Проверяем, есть ли performedCleaner, и получаем последний объект
    const lastPerformedCleaner = lastTask.performedCleaner?.at(-1);
    if (!lastPerformedCleaner) {
      return { success: false, message: "No performedCleaner found in the last task!" };
    }

    // Добавляем invoiceNumber к последнему объекту performedCleaner
    lastPerformedCleaner.invoiceNumber = invoiceNumber;

    // Сохраняем изменения в базе данных
    await printer.save();


    // Обновляем страницу
    revalidatePath(path);

    return { success: true, message: "Invoice number added successfully!" };

  } catch (error) {
    console.error("Error adding invoice number:", error);
    return { success: false, message: "An error occurred while adding the invoice number." };
  }
}

export async function addPrinterCost(
  price: number,
  id: string,
  path: string
) {
  try {
    await connectToDatabase();

    

    

    const printer = await Printer.findOneAndUpdate(
      { _id: id },
      { $set: {price: price } }, // Adding printer's produc number
      { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    );




    // Обновить страницу, если требуется
    revalidatePath(path);

    return {
      success: true,
      message: "Printers' price updated successfully!",
    };
  } catch (error) {
    console.error("Error updating printer cost:", error);
    return {
      success: false,
      message: "An error occurred while updating the printer's cost.",
    };
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
    // await Supplier.findOneAndUpdate({ponumber: printer[0].ponumber}, { $pull: { printers: printer[0]._id } })
    
    // Ищем и удаляем принтер из pallets в Supplier
    const result = await Supplier.findOneAndUpdate(
      { 
        "shipments.printers": printer[0]._id // Условие для поиска принтера в shipments
      },
      { 
        $pull: { 
          "shipments.$[shipment].printers": printer[0]._id // Удаляем принтер из массива printers внутри конкретного shipment
        }
      },
      { 
        arrayFilters: [{ "shipment.printers": printer[0]._id }], // Фильтруем shipment, содержащий этот принтер
        new: true // Возвращаем обновленный документ
      }
    );
    
    console.log("Updated Supplier:", result);
    
    if (!result) {
      return {
        success: false,
        message: "Printer not found in any shipment of the supplier!",
      };
    }




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
    // const printer = await Printer.find({_id: printerId})
    // await Printer.findByIdAndUpdate(
    //   printerId, 
    //   { $unset: { pallet: "", ponumber:"" } },
    //   { new: true }
    // )


    // const supplier = await Supplier.findOneAndUpdate(
    //   { ponumber: pallet.ponumber },
    //   { $pull: { printers: printerId } }, // Добавляем _id палета
    //   //{ new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    // );
    
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