"use server"
import Barcodes from "@/database/barcodes.model";
import { connectToDatabase } from "../mongoose"
import { CreateBarcodes, } from "./shared.types";
import { revalidatePath } from "next/cache";
// import { any } from "zod";


interface CreateBarcode {
  type: string;
  start: number;
  finish: number;
  path: string;
}

export async function generateBarcode__OLD(params: CreateBarcode) {
  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    const { type, start, finish, path } = params;

    // Определяем поле для проверки и обновления на основе type
    const fieldMap: Record<string, string> = {
      "WSE-P": "printers",
      "WSE-PP": "parts",
      "WSE-PL": "pallets",
    };

    const field = fieldMap[type];
    if (!field) {
      return { success: false, message: "Invalid type", info: "Unsupported barcode type" };
    }

    // Получаем текущую запись из базы данных
    const existingBarcodes = await Barcodes.findOne();

    if (existingBarcodes && start <= existingBarcodes[field]) {
      return {
        success: false,
        message: "Invalid barcode range",
        info: `The start value (${start}) must be greater than the current ${field} value (${existingBarcodes[field]})`,
      };
    }

    // Обновляем или создаем запись в базе данных
    const update = { [field]: finish }; // Обновляем значение до `finish`
    await Barcodes.updateOne({}, { $set: update }, { upsert: true });
    

    // Инвалидация кэша пути
    revalidatePath(path);

    return { success: true, message: "Barcodes list created successfully!" };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while creating barcodes",
      info: error,
    };
  }
}


interface CreateBarcode {
  type: string;
  start: number;
  finish: number;
  path: string;
}

export async function generateBarcode(params: CreateBarcode) {
  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    const { type, start, finish, path } = params;

    // Определяем поле для проверки и обновления на основе type
    const fieldMap: Record<string, string> = {
      "WSE-P": "printers",
      "WSE-PP": "parts",
      "WSE-PL": "pallets",
    };

    const field = fieldMap[type];
    if (!field) {
      return { success: false, message: "Invalid type", info: "Unsupported barcode type" };
    }

    // Получаем текущую запись из базы данных
    let existingBarcodes = await Barcodes.findOne();
    if (!existingBarcodes) {
      // Если записи нет, создаем новую с начальными значениями
      existingBarcodes = new Barcodes({
        printers: 0,
        parts: 0,
        pallets: 0,
      });
    }

    const currentValue = existingBarcodes[field] || 0; // Текущее значение в базе данных

    // Генерация массива баркодов
    const barcodes = Array.from(
      { length: finish - start + 1 },
      (_, index) => `${type}-${start + index}`
    );

    // Обновляем значение в базе данных только если finish больше текущего
    if (finish > currentValue) {
      existingBarcodes[field] = finish;
      await existingBarcodes.save();
    }

    // Инвалидация кэша пути
    revalidatePath(path);

    return {
      success: true,
      message: "Barcodes generated successfully!",
      barcodes, // Возвращаем массив сгенерированных баркодов
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while generating barcodes",
      info: error,
    };
  }
}




export async function generateBarcode_SLOMAN(params: CreateBarcode) {
  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    const { type, start, finish, path } = params;

    // Определяем поле для проверки и обновления на основе type
    const fieldMap: Record<string, string> = {
      "WSE-P": "printers",
      "WSE-PP": "parts",
      "WSE-PL": "pallets",
    };

    const field = fieldMap[type];
    if (!field) {
      return { success: false, message: "Invalid type", info: "Unsupported barcode type" };
    }

    // Получаем текущее значение из базы данных для соответствующего типа
    let existingBarcodes = await Barcodes.findOne();
    if (!existingBarcodes) {
      // Если записи в базе данных нет, создаем её с начальными значениями
      existingBarcodes = new Barcodes({
        printers: 0,
        parts: 0,
        pallets: 0,
        storage: 0,
      });
    }

    const currentValue = existingBarcodes[field] || 0; // Получаем текущее значение для указанного типа

    // Генерация массива баркодов
    const barcodes = Array.from(
      { length: finish - start + 1 },
      (_, index) => `${type}-${start + index}`
    );

    // Обновляем только если finish больше текущего значения
    if (finish > currentValue) {
      existingBarcodes[field] = finish;
      await existingBarcodes.save();
    }

    // Инвалидация кэша пути
    revalidatePath(path);

    return {
      success: true,
      message: "Barcodes generated successfully!",
      barcodes, // Возвращаем массив сгенерированных баркодов
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while generating barcodes",
      info: error,
    };
  }
}

interface CreateStorageBarcode {
  type: string; // Тип (например, WSE-W1)
  start: string; // Начальное значение (например, A1)
  finish: string; // Конечное значение (например, A12)
  path: string; // Путь для инвалидации кэша
}

export async function generateStorageBarcode(params: CreateStorageBarcode) {
  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    const { type, start, finish, path } = params;

    // Проверяем тип, чтобы убедиться, что он является допустимым
    if (!type.startsWith("WSE-W")) {
      return { success: false, message: "Invalid type", info: "Unsupported barcode type" };
    }

    // Получаем номер склада (например, W1 из WSE-W1)
    const warehouse = type.split("-")[1]; // Получаем "W1"

    // Разделяем начальное и конечное значение на части (ряд и полку)
    const startRow = start[0]; // Например, A
    const startShelf = parseInt(start.slice(1)); // Например, 1

    const finishRow = finish[0]; // Например, A
    const finishShelf = parseInt(finish.slice(1)); // Например, 12

    // Проверяем, что ряды совпадают
    if (startRow !== finishRow) {
      return { success: false, message: "Invalid range", info: "Start and finish rows must match" };
    }

    // Получаем текущее значение для storage из базы данных
    let existingBarcodes = await Barcodes.findOne();
    if (!existingBarcodes) {
      // Если записи в базе данных нет, создаем её с начальными значениями
      existingBarcodes = new Barcodes({
        printers: 0,
        parts: 0,
        pallets: 0,
        storage: 0,
      });
    }

    const currentValue = existingBarcodes.storage || 0; // Текущее значение для storage

    // Генерация массива баркодов
    const barcodes = Array.from(
      { length: finishShelf - startShelf + 1 },
      (_, index) => `${type}-${startRow}${startShelf + index}`
    );

    // Обновляем значение в базе данных, если finishShelf больше текущего значения
    if (finishShelf > currentValue) {
      existingBarcodes.storage = finishShelf;
      await existingBarcodes.save();
    }

    // Инвалидация кэша пути
    revalidatePath(path);

    return {
      success: true,
      message: "Storage barcodes generated successfully!",
      barcodes, // Возвращаем массив сгенерированных баркодов
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while generating storage barcodes",
      info: error,
    };
  }
}



export async function getBarcodes() {
  try {
    await connectToDatabase();

    const response = await Barcodes.findOne().lean();

    const barcodes = JSON.parse(JSON.stringify(response));

    return { success: true, barcodes };

  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      message: "An error occurred while fetching barcodes",
      info: error,
    };
  }
}