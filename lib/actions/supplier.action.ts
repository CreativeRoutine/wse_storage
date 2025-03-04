// actions/supplierActions.ts
"use server";
import Supplier from "@/database/supplier.model";
import { connectToDatabase } from "../mongoose";
import {
  GetSuppliersParams,
  UpdateSuppliersName,
  DeleteSupplierParams,
  CreateSuppliersParams,
  AddPalletToSupplierParams,
  AddPrinterToSupplierPalletParams,
  DeleteEmptySuppliersPalletParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Pallet from "@/database/pallet.model";
import Printer from "@/database/printer.model";
import Makes from "@/database/makes.model";
import { FilterQuery } from "mongoose";
import Parts from "@/database/parts.model";

export async function createSupplier(params: CreateSuppliersParams) {
  try {
    connectToDatabase();

    const { ponumber, createdOn } = params;

    const existingSupplier = await Supplier.findOne({ ponumber: ponumber });

    if (existingSupplier) {
      const id = JSON.parse(JSON.stringify(existingSupplier._id));
      return {
        success: true,
        message: "Supplier already exists.",
        id,
        info: "You may add pallet.",
      };
    } else {
      const newSupplier = await Supplier.create({
        ponumber,
        createdOn,
      });

      await newSupplier.save();
      const id = JSON.parse(JSON.stringify(newSupplier._id));

      return {
        success: true,
        message: "Supplier created. Now you can add pallet!",
        id,
        info: "Don't forget to give an name to Suplier.",
      };
    }
  } catch (error) {
    return "An error occurred while creating the pallet from Supplier";
    console.log("Error:", error);
  }
}

export async function getAllSuppliers(params: GetSuppliersParams) {
  try {
    await connectToDatabase();

    const { searchQuery } = params;

    const query: FilterQuery<typeof Supplier> = {};

    if (searchQuery) {
      query.$or = [
        { ponumber: { $regex: new RegExp(searchQuery, "i") } },
        { name: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const suppliers = await Supplier.find(query).sort({ field: -1 });

    return { suppliers };
  } catch (error) {
    throw error;
  }
}

export async function getSupplier(_id: string) {
  try {
    await connectToDatabase();

    const supplier = await Supplier.findOne({ _id: _id })
      .populate({
        path: "shipments",
        model: Pallet,
        select: "barcode location printers createdOn",
      })

      .lean();

    return supplier;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw new Error("Error fetching suppliers");
  }
}

export async function getSupplierPallet(_id: string) {
  try {
    await connectToDatabase();

    // Используем $elemMatch для поиска Supplier, содержащего паллет с указанным _id
    const supplier = await Supplier.findOne({
      shipments: { $elemMatch: { _id: _id } },
    });

    if (!supplier) {
      return { success: false, message: "Supplier or pallet not found!" };
    }

    // Ищем конкретный объект паллета в массиве shipments
    const pallet = supplier.shipments.find(
      (shipments: any) => shipments._id.toString() === _id
    );

    if (!pallet) {
      return { success: false, message: "Pallet not found in supplier!" };
    }

    // Выполняем populate для printers внутри паллета
    const populatedPallet = await Supplier.populate(pallet, {
      path: "printers",
      model: "Printer",
      select: "barcode sn productNumber createdOn price name parts",
    });

    return {
      success: true,
      pallet: populatedPallet,
      supplier,
    };
  } catch (error) {
    console.error("Error fetching pallet:", error);
    throw new Error("Error fetching pallet");
  }
}

// WORKABLE
export async function addPrinterToSupplierPallet(
  params: AddPrinterToSupplierPalletParams
) {
  try {
    connectToDatabase();

    // palletId = is Shipment or Suppliers pallet

    const { sn, productNumber, barcode, palletId, path, parts } = params;

    const existingPrinter = await Printer.findOne({ barcode });
    if (existingPrinter) {
      return { success: false, message: "Printer already exests!" };
    }

    //
    const supplier = await Supplier.findOne({
      shipments: { $elemMatch: { _id: palletId } },
    });
    //
    if (!supplier) {
      return { success: false, message: "Supplier lr shipment ID not found!" };
    }

    let printerModel;

    const printerMake = await Makes.findOne({ productNumber: productNumber });

    if (printerMake) {
      printerModel = printerMake.name;
    } else {
      printerModel = "";
    }

    // Creating a new printer with the _id of the pallet
    const newPrinter = await Printer.create({
      sn,
      productNumber,
      barcode,
      supplier: supplier._id, // Используем _id найденного паллета
      shipment: palletId,
      createdOn: Date.now(),
      ponumber: supplier.ponumber,
      name: printerModel,
      parts: parts,
    });

    // Проверяем, существует ли запись в Parts
    // const printerPart = await Parts.findOne({ productNumber });
    // if (!printerPart) {
    //   await Parts.create({
    //     productNumber,
    //     printerName: printerModel,
    //     parts: [],
    //   });
    // }

    // Используем _id нового Добавляем _id принтера для добавления в массив Makes
    const makes = await Makes.findOneAndUpdate(
      { productNumber: productNumber },
      {
        $set: { productNumber: productNumber },
        $push: { printers: newPrinter._id },
      }, // Adding printer's produc number
      { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
    );

    // Обновляем supplier, добавляя новый принтер в соответствующий pallet
    const updatedSupplier = await Supplier.findOneAndUpdate(
      {
        shipments: { $elemMatch: { _id: palletId } },
      },
      {
        $push: { "shipments.$.printers": newPrinter._id },
      },
      { new: true }
    );

    if (!updatedSupplier) {
      return {
        success: false,
        message: "Failed to update supplier with new printer!",
      };
    }

    revalidatePath(path);

    // Преобразование нового принтера в простой JavaScript объект
    const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));

    // return newPrinterPlain;
    return { success: true, message: "Printer addet to pallet successfully!" };
  } catch (error) {
    // Return an error message
    console.error("An error occurred while creating the printer:", error);
    return false;
  }
}

// MAY BE EXTRA
// export async function addSuppliersPrinterToPallet(params: AddPrinterToSupplierPalletParams) {

//   try {
//     connectToDatabase();

//     const { sn, productNumber, barcode, palletId, path } = params;

//     const existingPrinter = await Printer.findOne({ barcode });
//     if (existingPrinter) {
//       return { success: false, message: "Printer already exests!"};
//     }

//     //
//     const supplier = await Supplier.findOne({
//       shipments: { $elemMatch: { _id: palletId } },
//     });
//     //
//     if (!supplier) {
//       return { success: false, message: "Supplier not found!"};
//     }

//     let printerModel;

//     const printerMake = await Makes.findOne({ productNumber: productNumber });

//       if(printerMake){
//         printerModel = printerMake.name;

//       } else {
//         printerModel = "";
//       }

//       // Creating a new printer with the _id of the pallet
//     const newPrinter = await Printer.create({
//       sn,
//       productNumber,
//       barcode,
//       pallet: palletId, // Используем _id найденного паллета
//       createdOn: Date.now(),
//       ponumber: supplier.ponumber,
//       name: printerModel,
//     });

//     // Используем _id нового Добавляем _id принтера для добавления в массив Makes
//     const makes = await Makes.findOneAndUpdate(
//       { productNumber: productNumber },
//       { $set: { productNumber: productNumber }, $push: { printers: newPrinter._id } }, // Adding printer's produc number
//       { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
//     );

//     // Обновляем supplier, добавляя новый принтер в соответствующий pallet
//     const updatedSupplier = await Supplier.findOneAndUpdate(
//       {
//         pallets: { $elemMatch: { _id: palletId } },
//       },
//       {
//         $push: { "pallets.$.printers": newPrinter._id },
//       },
//       { new: true }
//     );

//     if (!updatedSupplier) {
//       return { success: false, message: "Failed to update supplier with new printer!" };
//     }

//     revalidatePath(path);

//     // Преобразование нового принтера в простой JavaScript объект
//     const newPrinterPlain = JSON.parse(JSON.stringify(newPrinter));

//     // return newPrinterPlain;
//     return { success: true, message: "Printer addet to pallet successfully!"};

//   } catch (error) {
//     // Return an error message
//     console.error("An error occurred while creating the printer:", error);
//     return false;
//   }
// }

export async function updateSupplierPalletCostAndPrinters(
  price: number,
  id: string,
  path: string
) {
  try {
    await connectToDatabase();

    // Найти Supplier, содержащий паллет с указанным _id
    const supplier = await Supplier.findOne({
      shipments: { $elemMatch: { _id: id } },
    });

    if (!supplier) {
      return {
        success: false,
        message: "Pallet not found!",
        info: "This pallet does not exist in the database",
      };
    }

    // Найти нужный паллет в массиве pallets
    const pallet = supplier.shipments.find(
      (shipment: any) => shipment._id.toString() === id
    );

    if (!pallet) {
      return { success: false, message: "Pallet not found in the supplier!" };
    }

    // Обновить (или создать) поле price для паллета
    pallet.price = price;

    // Получить все принтеры, связанные с этим паллетом
    const printerIds = pallet.printers; // массив ObjectId
    if (!printerIds || printerIds.length === 0) {
      return {
        success: false,
        message: "No printers found in the pallet!",
      };
    }

    // Разделить цену равномерно между принтерами
    const dividedPrice = price / printerIds.length;

    // Обновить цену для каждого принтера
    await Printer.updateMany(
      { _id: { $in: printerIds } },
      { $set: { price: dividedPrice } }
    );

    // Сохранить изменения в документе Supplier
    await supplier.save();

    // Обновить страницу, если требуется
    revalidatePath(path);

    return {
      success: true,
      message: "Pallet cost and printers' prices updated successfully!",
    };
  } catch (error) {
    console.error("Error updating pallet cost and printers:", error);
    return {
      success: false,
      message: "An error occurred while updating the pallet cost and printers.",
    };
  }
}

// Messaging ready
export async function deleteEmptySuppliersPallet(
  params: DeleteEmptySuppliersPalletParams
) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { id, path } = params;

    // Найти Supplier, содержащий паллет с указанным _id
    const supplier = await Supplier.findOne({
      shipments: { $elemMatch: { _id: id } },
    });

    if (!supplier) {
      return {
        success: false,
        message: "Supplier's pallet not found",
        info: "This pallet does not exist in the database",
      };
    }

    // Удалить паллет с указанным _id из массива pallets
    supplier.shipments = supplier.shipments.filter(
      (shipment: any) => shipment._id.toString() !== id
    );

    // Сохранить изменения
    await supplier.save();
    const supplierID = JSON.parse(JSON.stringify(supplier._id));

    // Revalidate the path
    revalidatePath(path);

    return {
      success: true,
      message: "Pallet deleted successfully!",
      supplierID,
    };
  } catch (error) {
    // Log any errors
    console.error("Error:", error);

    // Return an error message
    return {
      success: false,
      message: "An error occurred while deleting the pallet",
      info: "This pallet does not exist in the database",
    };
  }
}

// Messaging ready
export async function updateSupplier(params: UpdateSuppliersName) {
  try {
    await connectToDatabase();
    const { _id, name, path } = params;
    const supplier = await Supplier.findOne({ _id });
    if (!supplier) {
      return {
        success: false,
        message: "Supplier can't be deleted!",
        info: "Check if the supplier not exists in the database",
      };
    }
    await Supplier.findOneAndUpdate(supplier._id, { $set: { name: name } });
    revalidatePath(path);

    return { success: true, message: "Supplier's name updated successfully!" };
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Error updating supplier");
  }
}

export async function addPalletToSupplier(params: AddPalletToSupplierParams) {
  try {
    await connectToDatabase();

    const { _id, barcode, createdOn, path } = params;

    // Находим поставщика
    const supplier = await Supplier.findOne({ _id });

    if (!supplier) {
      return {
        success: false,
        message: "Supplier not found!",
        info: "How is it possible???",
      };
    }

    // Проверяем, существует ли уже паллет с таким же barcode
    const palletExists = supplier.shipments.some(
      (shipment: any) => shipment.barcode === barcode
    );

    if (palletExists) {
      return {
        success: false,
        message: "Pallet with this barcode / Shipment ID already exists!",
      };
    }

    // Добавляем новый паллет
    supplier.shipments.push({ barcode: barcode, createdOn: createdOn });

    // Сохраняем изменения
    await supplier.save();

    // Обновляем кеш страницы
    revalidatePath(path);

    return {
      success: true,
      message: "Pallet from Supplier added successfully!",
    };
  } catch (error) {
    console.error("Error updating supplier:", error);
    throw new Error("Error updating supplier");
  }
}

// Messaging ready
export async function deleteSupplier(params: DeleteSupplierParams) {
  try {
    await connectToDatabase();
    const { _id, path } = params;
    const supplier = await Supplier.findOne({ _id: _id });

    if (!supplier) {
      return {
        success: false,
        message: "Supplier can't be deleted!",
        info: "Check if the supplier not exists in the database",
      };
    }
    if (supplier.shipments.length > 0) {
      return {
        success: false,
        message: "Supplier can't be deleted!",
        info: "Check if the supplier is not linked to any printer or pallet",
      };
    }
    await Supplier.deleteOne({ _id: supplier._id });

    revalidatePath(path);

    return { success: true, message: "Supplier deleted successfully!" };

    // return { success: "Supplier deleted successfully" };
  } catch (error) {
    console.error("Error deleting supplier:", error);
    throw new Error("Error deleting supplier");
  }
}
