"use server"
import Pallet from "@/database/pallet.model";
import Printer from "@/database/printer.model";
import { connectToDatabase } from "../mongoose"
import { CreatePalet, GetPalet, DeletePalletParams, GetPalletsParams, UpdatePaletLocation, UpdatePaletCost, GetPaletByIdParams} from "./shared.types";
import { revalidatePath } from "next/cache";
import Supplier from "@/database/supplier.model";
// import { any } from "zod";


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
      return true;

    } else {
      return false;
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

export async function updatePaletPlace(params:UpdatePaletLocation){
  try {
    connectToDatabase();
    const { location, id, path} = params;

    const pallet = await Pallet.findOne({ _id: id });
    if (!pallet) {
      return "This printer does not exists in the database";
    }

    await Pallet.findOneAndUpdate(pallet._id, { $set: { location: location } });

    revalidatePath(path);
    return true;

  } catch (error) {
    console.log("Error:", error);
    return false;
  }

}

export async function updatePaletCost(params:UpdatePaletCost){
  try {
    connectToDatabase();
    const { price, id, path} = params;

    const pallet = await Pallet.findOne({ _id: id });
    if (!pallet) {
      return "This printer does not exists in the database";
    }

    await Pallet.findOneAndUpdate(pallet._id, { $set: { price: price } });
    revalidatePath(path);
    return true
  } catch (error) {
      console.log("Error:", error);
      return false;
  }
}

export async function deletePallet(params:DeletePalletParams) {
  try {
    // Connect to the database
    await connectToDatabase();

    const { id, path } = params;

    const pallet = await Pallet.findOne({ _id: id });
    if(pallet){

      await Pallet.findOneAndUpdate(pallet._id, { $set: { location: "" } });

      // Find Supplier by printer id
      await Supplier.findOneAndUpdate({ponumber: pallet.ponumber}, { $pull: { pallets: pallet._id } })
      
      // Find the pallet by its ID and delete it
      await Pallet.findOneAndDelete({_id: id});

    }


    // Revalidate the path
    revalidatePath(path);
    return true


  } catch (error) {
    // Log any errors
    console.log("Error:", error);
    // Return an error message
    return false;
  }
}




// export async function updatePalet(params:UpdatePalet){
//   try {
//     connectToDatabase();
//     const { paletSn,printerSn, path} = params;

//     const existingPallet = await Pallet.findOne({ sn: paletSn });
//     if (!existingPallet) {
//       return "This printer already exists in the database";
//     }

//     const updatedPallet = await Pallet.findOneAndUpdate({ sn: paletSn }, { $push: { printers: printerSn } }, { new: true });
//     revalidatePath(path);
//   } catch (error) {
//       console.log("Error:", error);
//   }
// }











// CreatePalletModelParams took from shared.types.d.ts 
// to create a new printer model 
// export async function createPalletModel(params:CreatePalletModelParams) {
//   try {
//     connectToDatabase();
    
//       console.log("THIS IS PARAMS: ", params)
//       const { sn, locker,  path} = params;

//       const createdAt = new Date();

//       const existingPallet = await Pallet.findOne({ sn, locker, createdAt });
//       if (existingPallet) {
//         // If a printer with the same make and model exists, return an error message
//         return "This printer already exists in the database";
//     }

//     const newPallet = await Pallet.create({ sn, locker, createdAt });
      
//     revalidatePath(path);
//   } catch (error) {
//       // Log any errors
//       console.log("Error:", error);
//       // Return an error message
//       return "An error occurred while creating the printer";
//   }
// }



