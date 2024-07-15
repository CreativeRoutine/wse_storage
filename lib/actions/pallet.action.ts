"use server"
import Pallet from "@/database/pallet.model";
import Printer from "@/database/printer.model";
import { connectToDatabase } from "../mongoose"
import { CreatePalet, GetPalet, DeletePalletParams, GetPalletsParams, UpdatePaletLocation, UpdatePaletCost, GetPaletByIdParams} from "./shared.types";
import { revalidatePath } from "next/cache";
import Supplier from "@/database/supplier.model";
// import { any } from "zod";

// Messaging ready
export async function createPalet(params: CreatePalet) {
  try {
    connectToDatabase();

    const { ponumber, barcode, user, path, createdOn } = params;

    const existingPallet = await Pallet.findOne({ barcode: barcode });

    if (!existingPallet) {
      // Создание нового палета
      const newPalet = await Pallet.create({
        ponumber,
        barcode,
        user,
        createdOn
      });

      // Используем _id нового палета для добавления в массив pallets поставщика
      const supplier = await Supplier.findOneAndUpdate(
        { ponumber: ponumber },
        { $push: { pallets: newPalet._id } }, // Добавляем _id палета
        { new: true, upsert: true, setDefaultsOnInsert: true } // Создаем нового поставщика, если он не найден
      );

      // how to return a message to the user if existingPallet is true?
      revalidatePath(path);
      return { success: true, message: "Pallet created successfully!" };

    } else {
      return { success: false, message: "An error occurred while creating the pallet", info: "This pallet already exists in the database"};
    }

  } catch (error) {
    return "An error occurred while creating the pallet";
    console.log("Error:", error);
  }
}

export async function getPallets(params:GetPalletsParams) {
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
    console.log(location.length == 0)

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
export async function updatePaletCost(params:UpdatePaletCost){
  try {
    connectToDatabase();
    const { price, id, path} = params;

    const pallet = await Pallet.findOne({ _id: id });
    if (!pallet) {
      return { success: false, message: "Pallet location not changed!", info: "This pallet not exists in the database"}; 
    }

    await Pallet.findOneAndUpdate(pallet._id, { $set: { price: price } });
    revalidatePath(path);
    
    return { success: true, message: "Pallet location changed successfully!"}; 

  } catch (error) {
      console.log("Error:", error);
      return false;
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
    }else{
      await Pallet.findOneAndUpdate(pallet._id, { $set: { location: "" } });

      // Find Supplier by printer id
      await Supplier.findOneAndUpdate({ponumber: pallet.ponumber}, { $pull: { pallets: pallet._id } })
      
      // Find the pallet by its ID and delete it
      await Pallet.findOneAndDelete({_id: id});

    }


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