"use server";

import { connectToDatabase } from "../mongoose";
import Printer from '@/database/printer.model'; // Модель принтера
import Parts from '@/database/parts.model'; // Модель запчастей

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



// export async function decrementPart(printerName: string, partName: string, barcode: string) {
//   try {
//     await connectToDatabase(); // Подключаемся к базе данных

//     // Найдем запчасти для данного принтера
//     const existingParts = await Parts.findOne({ printerName });
//     if (!existingParts) {
//       return { success: false, message: "No parts found for this printer" };
//     }

//     // Найдем нужную деталь и уменьшим количество
//     const part = existingParts.parts.find(p => p.name === partName && p.barcode === barcode);
//     if (!part || part.quantity === 0) {
//       return { success: false, message: "Part not found or quantity is already zero" };
//     }

//     part.quantity -= 1; // Уменьшаем количество

//     // Если количество стало 0, можно решить, нужно ли удалять запчасть из базы данных
//     if (part.quantity === 0) {
//       existingParts.parts = existingParts.parts.filter(p => p.name !== partName || p.barcode !== barcode);
//     }

//     // Сохраняем изменения
//     await existingParts.save();

//     return { success: true, message: `Part ${partName} decremented successfully` };
//   } catch (error) {
//     console.error("Error decrementing part:", error);
//     return { success: false, message: "Error decrementing part" };
//   }
// }