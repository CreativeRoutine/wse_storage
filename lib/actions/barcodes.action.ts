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