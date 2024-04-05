"use server"

import Pallet from "@/database/pallet.model";
import Printer from "@/database/printer.model";
import { connectToDatabase } from "../mongoose"
import { CreatePalet, GetPalet, UpdatePalet, CreatePalletModelParams, DeletePalletParams, GetPalletsParams, SetPricePalet} from "./shared.types";
import { revalidatePath } from "next/cache";
import { any } from "zod";


export async function createPalet(params:CreatePalet){

  try {
    connectToDatabase();
    const createdOn = new Date();
    const { sn, barcode,  printers, creator, path, location} = params;

    // Создание нового палета
    const palet = await Pallet.create({
      sn,
      barcode,
      creator,
      createdOn
    });

    // Массив для хранения обработанных серийных номеров принтеров
    const printerDocuments = [];

    // Обработка каждого серийного номера принтера
    for (const printerSn of printers) {
      const existingPrinter = await Printer.findOneAndUpdate(
        // Поиск принтера по серийному номеру
        { sn: printerSn },
        // Если принтер найден, обновляем его данные, добавляя идентификатор палета
        { $push: { palets: palet._id } },
        // Настройки для создания принтера, если он не найден
        { upsert: true, new: true }
      );

      printerDocuments.push(existingPrinter._id);
    }

    // Обновление палета серийными номерами принтеров
    await Pallet.findByIdAndUpdate(palet._id, {
      $push: { printers: { $each: printerDocuments } }
    });
      
    revalidatePath(path);
    
  } catch (error) {
    console.log("Error:", error);
    return "An error occurred while creating the printer";
  }
}

export async function getPalet(currentSN:GetPalet){
  try{
    connectToDatabase();

    // const { currentSN } = params.currentSN;
    

    const sns:any = [];

    const pallets = await Pallet.find({sn:currentSN.currentSN}).lean();

    const currentPallet = JSON.parse(JSON.stringify(pallets[0].printers));
    
    
    for (const printer of currentPallet) {
      const printersSn = await Printer.findOne({_id: printer}).lean();

      sns.push(printersSn?.sn); // Fix: Access the 'sn' property using optional chaining operator
    }




    
    return({pallets, sns})
    
  }catch(error){
    console.log("Pallet couldn't load. Error:", error);
  } 
}







export async function updatePalet(params:UpdatePalet){
  try {
    connectToDatabase();
    const { paletSn,printerSn, path} = params;

    const existingPallet = await Pallet.findOne({ sn: paletSn });
    if (!existingPallet) {
      return "This printer already exists in the database";
    }

    const updatedPallet = await Pallet.findOneAndUpdate({ sn: paletSn }, { $push: { printers: printerSn } }, { new: true });
    revalidatePath(path);
  } catch (error) {
      console.log("Error:", error);
  }
}

export async function setPaletCost(params:SetPricePalet){
  console.log("pallet action reached")

  try {
    connectToDatabase();
    console.log("palle action turned on")
    const { sn, paletCost, path} = params;

    const existingPallet = await Pallet.findOne({ sn: sn });
    if (!existingPallet) {
      return "This palet is not exists in the database";
    }

    const updatedPallet = await Pallet.findOneAndUpdate({ sn: sn }, { $push: {paletCost: paletCost} }, { new: true });
    revalidatePath(path);
  } catch (error) {
      console.log("Error:", error);
  }
}



export async function getAllPalets(){
  try{
    connectToDatabase();
    const pallets = await Pallet.find({}).lean();
    return{pallets}

  } catch(error){
    console.log("Can't receive all palets from server. Error:", error);
  }
}









// CreatePalletModelParams took from shared.types.d.ts 
// to create a new printer model 
export async function createPalletModel(params:CreatePalletModelParams) {
  try {
    connectToDatabase();
    
      console.log("THIS IS PARAMS: ", params)
      const { sn, locker,  path} = params;

      const createdAt = new Date();

      const existingPallet = await Pallet.findOne({ sn, locker, createdAt });
      if (existingPallet) {
        // If a printer with the same make and model exists, return an error message
        return "This printer already exists in the database";
    }

    const newPallet = await Pallet.create({ sn, locker, createdAt });
      
    revalidatePath(path);
  } catch (error) {
      // Log any errors
      console.log("Error:", error);
      // Return an error message
      return "An error occurred while creating the printer";
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

export async function deletePallet(params:DeletePalletParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { palletId, path } = params;

    // Find the pallet by its ID and delete it
    await Pallet.findByIdAndDelete(palletId);

    // Revalidate the path
    revalidatePath(path);


  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return "An error occurred while deleting the printer";
  }
}