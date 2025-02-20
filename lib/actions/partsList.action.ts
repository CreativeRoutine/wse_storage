"use server"

import { connectToDatabase } from "../mongoose";
import {  CreatePrinterParams,GetPrinterByBarcodeParams, updatePrinterPreviewParams, FindPrinterParams, AddPrinterToPalletParams, updatePrinterPONParams, GetPrintersParams, GetPrinterParams, GetPrinterPopulatedParams, UnPinPrinterParams, DeletePrinterParams, PinToPalletParams } from "./shared.types";
import PartsList from "@/database/partsList.model";
import { revalidatePath } from "next/cache";

import Supplier from "@/database/supplier.model";
import Makes from "@/database/makes.model";


import mongoose from 'mongoose';
import User from '@/database/user.model';
import Employee from "@/database/employee.model";
import Parts from "@/database/parts.model";

// AFTER PARTS IMPLEMENTATION
export async function createPartsList(params: any) {
  try {
    await connectToDatabase(); // Подключение к базе данных

    const { partName, path } = params;

    // Проверяем, существует ли запись в коллекции PartsList
    let partsList = await PartsList.findOne();

    if (!partsList) {
      // Если запись не найдена, создаем новую запись с первой частью
      partsList = await PartsList.create({ partName: [partName] });
      return { success: true, message: "Parts List создана и первый элемент добавлен" };
    } else {
      // Если запись уже существует, добавляем новую часть к полю partName
      partsList.partName.push(partName);
      await partsList.save(); // Сохраняем изменения
      return { success: true, message: "Part name добавлен в существующий Parts List!" };
    }

    // Перезагружаем путь
    revalidatePath(path);

    // Возвращаем успешный результат
    return { success: true, message: "Запись о принтере и его частях успешно создана!" };

  } catch (error) {
    console.error("Произошла ошибка при создании записи:", error);
    return { success: false, message: "Произошла ошибка при создании записи о принтере" };
  }
}

export async function getAllPartsList(){
  try{
    await connectToDatabase();

    const parts = await PartsList.find({}).lean();

    return parts[0];

  } catch(error){
    console.log(error);
    throw error;
  }
}

export async function renamePartInList(params: any) {
  try {
    console.log("RENAME PART IN LIST");
    await connectToDatabase(); // Подключение к базе данных

    const { oldName, newName, path } = params;

    // Находим запись в коллекции PartsList
    let partsList = await PartsList.findOne();

    if (!partsList) {
      return { success: false, message: "Parts List not found." };
    }

    // Проверяем, существует ли oldName в массиве partName
    const partIndex = partsList.partName.indexOf(oldName);
    if (partIndex === -1) {
      return { success: false, message: "Часть с указанным названием не найдена." };
    }

    // Обновляем название части в PartsList
    partsList.partName[partIndex] = newName;
    await partsList.save(); // Сохраняем изменения

    // Обновляем названия частей в коллекции Parts
    const partsToUpdate = await Parts.find({
      "parts.partsName": oldName,
    });

    if (!partsToUpdate || partsToUpdate.length === 0) {
      return { success: false, message: "No parts found to update." };
    }

    for (const part of partsToUpdate) {
      for (const section of part.parts) {
        if (section.partsName === oldName) {
          section.partsName = newName; // Меняем название
        }
      }
      await part.save(); // Сохраняем изменения
    }

    console.log(`Updated ${partsToUpdate.length} documents in the Parts collection.`);

    // Перезагружаем путь
    revalidatePath(path);

    return { success: true, message: "Название части успешно обновлено в списке и коллекции Parts." };

  } catch (error) {
    console.error("Произошла ошибка при обновлении записи:", error);
    return { success: false, message: "Произошла ошибка при обновлении названия части." };
  }
}

export async function deletePartFromList(params: any) {
  try {

    await connectToDatabase(); // Подключение к базе данных

    const { oldName, path } = params;

    // Находим запись в коллекции PartsList
    let partsList = await PartsList.findOne();

    if (!partsList) {
      return { success: false, message: "Parts List didn't find." };
    }

    // Проверяем, существует ли oldName в массиве partName
    const partIndex = partsList.partName.indexOf(oldName);
    if (partIndex === -1) {
      return { success: false, message: "Part with this name not found." };
    }

    // Удаляем часть из массива partName
    partsList.partName.splice(partIndex, 1); // Удаляет элемент по индексу
    await partsList.save(); // Сохраняем изменения

    // Перезагружаем путь
    revalidatePath(path);

    return { success: true, message: "Part deleted." };
  } catch (error) {
    console.error("Произошла ошибка при удалении записи:", error);
    return { success: false, message: "Произошла ошибка при удалении части." };
  }
}



export async function fetchPartsList(printerProductNumber: string) {
  try {
    await connectToDatabase(); // Подключение к базе данных

    // Получаем детали по номеру продукта принтера
    const partsData = await Parts.findOne({ printerProductNumber });
    if (!partsData || !partsData.parts) {
      return { success: false, message: "No parts found for this printer model" };
    }

    // Преобразуем части из Map в массив объектов с именами
    const partsArray = Array.from(partsData.parts.keys()); // Извлекаем имена частей

    return { success: true, parts: partsArray };

  } catch (error) {
    console.error("Error fetching parts list:", error);
    return { success: false, message: "An error occurred while fetching parts list" };
  }
}