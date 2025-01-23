"use server"
import Pallet from "@/database/pallet.model";
import Printer from "@/database/printer.model";
import { connectToDatabase } from "../mongoose"
import { CreatePalet, GetPalet, DeletePalletParams, GetPalletsParams, UpdatePaletLocation, UpdatePaletCost, GetPaletByIdParams, AddPrinterToStoragePalet} from "./shared.types";
import { revalidatePath } from "next/cache";
import Supplier from "@/database/supplier.model";
// import { any } from "zod";

export async function createPalet(params: CreatePalet) {
  try {
    connectToDatabase();

    const {  barcode, location, path } = params;

    const existingPallet = await Pallet.findOne({ barcode: barcode });

    if (existingPallet) {
      
      return { success: false, message: "An error occurred while creating the pallet", info: "This pallet already exists in the database"};
      
    } else {
    }
    
    // Создание нового палета
    const newPalet = await Pallet.create({
      barcode,
      location: "",
      createdOn: new Date(),
      printers: []
    });

    newPalet.save();

    const paletId = JSON.parse(JSON.stringify(newPalet._id));
    
    revalidatePath(path);
    return { success: true, message: "Pallet created successfully!", paletId };

  } catch (error) {
    return "An error occurred while creating the pallet";
    console.log("Error:", error);
  }
}

export async function getPallets___OLD(params:GetPalletsParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const pallets = await Pallet.find({}).lean();

    // //.populate({path: "tags", model: Tag})
    // //.populate({path: 'author', model: User}) 
    return{pallets}

  } catch (error) {
    
    throw error;
  }
}



export async function getPallets_WORKABLE_LAST(params:GetPalletsParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Here we find all printers. .lean is used to convert the Mongoose document to a plain JavaScript object
    const pallets = await Pallet.find({}).lean();


    return{pallets}

  } catch (error) {
    
    throw error;
  }
}

export async function getPallets(params: GetPalletsParams) {
  try {
    // Подключаемся к базе данных
    await connectToDatabase();

    const { searchQuery } = params; // Убедимся, что передаем searchQuery из параметров
    const query: any = {};

    // Если есть поисковый запрос, добавляем фильтрацию
    if (searchQuery) {
      query.$or = [
        { "printers.name": { $regex: new RegExp(searchQuery, "i") } }, // Поиск по имени принтера
        { barcode: { $regex: new RegExp(searchQuery, "i") } }, // Поиск по баркоду паллеты
      ];
    }

    // Используем агрегацию для поиска
    const pallets = await Pallet.aggregate([
      {
        $lookup: {
          from: "printers", // Соединяем с коллекцией принтеров
          localField: "printers",
          foreignField: "_id",
          as: "printers",
        },
      },
      {
        $match: query, // Применяем фильтр по запросу
      },
    ]);

    return { pallets };
  } catch (error) {
    console.error("Error fetching pallets:", error);
    throw new Error("Error fetching pallets");
  }
}



export async function getPalet(params: GetPalet) {
  try {
    await connectToDatabase();

    const { _id } = params;

    // Загрузка паллетов с заполнением информации о принтерах
    const pallets = await Pallet.findOne({ _id: _id })
    .populate({ path: "printers", model: Printer, select: "barcode sn productNumber" })
    .lean();

    return pallets ;
  } catch (error) {
    console.log("This Pallet couldn't load. Error:", error);
    return { error: "This Pallet couldn't load." };
  }
}

export async function getPaletById(params: GetPaletByIdParams) {
  try {
    await connectToDatabase();

    const { _id } = params;

    // Загрузка паллетов с заполнением информации о принтерах
    const pallet = await Pallet.findOne({ _id: _id })
    // .populate({ path: "printers", model: Printer, select: "barcode sn productNumber" })
    .lean();

    return { pallet };
  } catch (error) {
    console.log("This Pallet couldn't load. Error:", error);
    return { error: "This Pallet couldn't load." };
  }
}

// Messaging ready
export async function updatePaletPlace(params:UpdatePaletLocation){
  try {
    connectToDatabase();
    const { location, id, path} = params;

    const pallet = await Pallet.findOne({ _id: id });
    if (!pallet) {
      return { success: false, message: "Pallet location not changed", info: "This printer does not exists in the database"}; 
    }
    // console.log(location.length == 0)

    await Pallet.findOneAndUpdate(pallet._id, { $set: { location: location } });

    revalidatePath(path);

    if(location.length === 0 || location === ""){
      return { success: true, message: "Pallet unpinned successfully!"}; 
    } 
    else{
      return { success: true, message: "Pallet location changed successfully!"}; 
    }

  } catch (error) {
    console.log("Error:", error);
    return false;
  }

}

// Messaging ready
export async function addPrinterToStoragePallet(params: AddPrinterToStoragePalet) {
  try {
    await connectToDatabase();

    const { barcode, palletId, path } = params;

    // Находим принтер по его штрих-коду
    const printer = await Printer.findOne({ barcode: barcode });
    if (!printer) {
      return { success: false, message: "Printer not found!", info: "Something went wrong!" };
    }

    // Находим паллет по его ID
    const pallet = await Pallet.findOne({ _id: palletId });
    if (!pallet) {
      return { success: false, message: "Pallet not found!", info: "Something went wrong!" };
    }

    // Проверяем, что printers существует и является массивом
    if (!Array.isArray(pallet.printers)) {
      pallet.printers = [];
    }

    // Добавляем ID принтера в массив printers паллета
    if (!pallet.printers.includes(printer._id)) {
      pallet.printers.push(printer._id);
      await pallet.save(); // Сохраняем изменения в паллете
    }

    // Проверяем, что поле pallet в принтере существует и является массивом
    if (!printer.pallet) {
      printer.pallet = pallet._id;
      await printer.save(); // Сохраняем изменения в принтере
    } else if (printer.pallet.toString() !== pallet._id.toString()) {
      // Если принтер уже привязан к другому паллету, возвращаем ошибку
      return {
        success: false,
        message: "Printer is already assigned to another pallet.",
        info: "Remove it from the current pallet first.",
      };
    }

    // Обновляем путь (если требуется)
    if (path) {
      revalidatePath(path);
    }

    return { success: true, message: "Printer added to pallet!", info: "Congratulations!" };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, message: "An error occurred.", info: error };
  }
}


// Messaging ready
export async function deletePallet(params:DeletePalletParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { id, path } = params;

    const pallet = await Pallet.findOne({ _id: id });
    if(!pallet){ 
      return { success: false, message: "An error occurred while deleting the pallet", info: "This pallet not exists in the database"}; 
    }
    
      // await Pallet.findOneAndUpdate(pallet._id, { $set: { location: "" } });

      // Find Supplier by printer id
      
      
      // Find the pallet by its ID and delete it
      await Pallet.findOneAndDelete({_id: id});




    // Revalidate the path
    revalidatePath(path);
    return { success: true, message: "Pallet deleted successfully!" };


  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return { success: false, message: "An error occurred while deleting the pallet", info: "This pallet not exists in the database"};
  }
}