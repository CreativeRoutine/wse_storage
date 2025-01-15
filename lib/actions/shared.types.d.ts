import { start } from 'repl';
import { Schema } from "mongoose";
import { IUser } from "@/database/user.model";
import { ISupplier } from "@/database/supplier.model";

// /////////////////////
// PRINTER TYPES
// /////////////////////
export interface AddPrinterToPalletParams {
  sn: string;
  productNumber: string;
  barcode: string;
  palletId: string;
  path: string;
}
export interface CreatePrinterParams {
  // ponumber?: string;
  sn: string;
  productNumber: string;
  barcode: string;
  path: string;
  createdOn: Date;
  preview?: string;
}

export interface CreatePrinterModelParams {
  make: string;
  model: string;
  pnum: string;
//   tags: string[];
//   author: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface DeletePrinterModelParams {
  printerId: string;
  path: string;
}

export interface DeletePrinterParams {
  id: string;
  path: string;
}

export interface UnPinPrinterParams {
  id: string;
  printerId: string;
  path: string;
}

export interface PinToPalletParams {
  id: string;
  palletBarcode: string;
  path: string;
}


export interface GetPrintersParams {
  page?: number;
  pageSize: number;
  searchQuery?: string;
  filter?: string;
  from?: any;
  to?: any;
  status?: string;
}

export interface FindPrinterParams {
  barcode: string;
}

export interface FindPrinterCleanerParams {
  barcode: string;
}

export interface GetPrinterByBarcodeParams {
  barcode: string;
  path: string;
}

export interface GetPrinterPopulatedParams {
  _id: string;
  path: string;
}

export interface GetPrinterParams{
  // sn: string;
  barcode: string;
}
export interface updatePrinterPONParams{
  _id: string;
  ponumber: string;
  path: string;

}

export interface addPrinterCommentParams{
  _id: string;
  comment: string;
  path: string;

}

export interface addPrinterInvoiceNumberParams{
  _id: string;
  invoiceNumber: string;
  path: string;

}

export interface updatePrinterPreviewParams{
  _id: string;
  preview: string;
  path: string;

}

export interface FindPrinterBySnParams {
  sn: string;
}

// /////////////////////
// MAKES TYPES
// /////////////////////

export interface CreateMakesParams {
  name?: string;
  productNumber: string;
  path: string;
}

export interface GetMakeByIdParams {
  _id: string;
  path?: string;
}

export interface GetAllMakesParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface UpdateMakesParams {
  name: string;
  path: string;
}

export interface UpdateMakeName{
  name?: string;
  _id: string;
  path: string;
}

export interface UpdateMakePreviewParams{
  _id: string;
  preview: string;
  path: string;
}

export interface DeleteMakeParams {
  _id: string;
  path: string;
}






// /////////////////////
// PART TYPES
// /////////////////////
export interface CreatePartParams {
  productNumber: string;
  make: string;
}


export interface CreatePartModelParams {
  pn: string;
  name: string;
  path: string;
}

export interface GetAllPartsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}



export interface GetPartsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}
export interface DeletePartsParams {
  partId: string;
  path: string;
}

// /////////////////////
// BARCODES TYPES
// /////////////////////
export interface CreateBarcodes{
  type: string; 
  start: number;
  finish: number;
  path: string;
}


// /////////////////////
// PALLET TYPES
// /////////////////////
export interface CreatePalet{
  location?: string;
  barcode: string; 
  path: string;
}

export interface UpdatePaletLocation{
  location: string;
  id: string;
  path: string;
}

export interface AddPrinterToStoragePalet{
  palletId: string;
  barcode: string;
  path: string;
}

export interface UpdatePaletCost{
  price: string;
  id: string;
  path: string;
}

export interface UpdatePalet{
  paletSn: string;
  printerSn: string;
  paletCost?: number;
  path: string;
}

export interface SetPricePalet{
  sn: string;
  paletCost: string;
  path: string;

}

export interface GetPalet{
  _id: string;
  paletId?: string;
  // sn: string;
}

export interface GetPaletByIdParams{
  _id: string;
  // sn: string;
}



// /////////////////////
// SUPPLIERS TYPES
// /////////////////////
export interface CreateSuppliersParams {
  ponumber: string;

  createdOn: Date;
}

export interface AddPalletToSupplierParams{
  _id: string;
  barcode: string;
  createdOn: Date;
  path: string;
}

export interface DeleteEmptySuppliersPalletParams {
  id: string;
  path: string;
}

export interface GetSuppliersParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface AddPrinterToSupplierPalletParams {
  sn: string,
  productNumber: string, 
  barcode: string, 
  palletId: string, 
  path: string,
  parts: boolean,
}

export interface UpdateSuppliersName{
  name: string;
  _id: string;
  path: string;
}

export interface DeleteSupplierParams {
  _id: string;
  path: string;
}





export interface CreatePalletModelParams {
  sn: string;
  locker: string;
  // createdA: Date;
  // printers: string[];
  // tags: string[];
//   author: Schema.Types.ObjectId | IUser;
  path: string;
}

export interface GetPalletsParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface GetPalletsFilteringParams {
  // page?: number;
  // pageSize: number;
  searchQuery?: string;
  // filter?: string;
  // from?: any;
  // to?: any;
  // status?: string;
}

export interface DeletePalletParams {
  id: string;
  path: string;
}

// /////////////////////
// WORK TYPES
// /////////////////////

export interface CreateWorkModelParams {
  name: string;
  path: string;
  // locker: string;
  // printers: string[];
  // tags: string[];
}
export interface GetWorksParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}

export interface DeleteWorkParams {
  workId: string;
  path: string;
}








// export interface CreateAnswerParams {
//   content: string;
//   author: string; // User ID
//   question: string; // Question ID
//   path: string;
// }

// export interface GetAnswersParams {
//   questionId: string;
//   sortBy?: string;
//   page?: number;
//   pageSize?: number;
// }

// export interface AnswerVoteParams {
//   answerId: string;
//   userId: string;
//   hasupVoted: boolean;
//   hasdownVoted: boolean;
//   path: string;
// }

export interface SearchParams {
  query?: string | null;
  type?: string | null;
}

// export interface RecommendedParams {
//   userId: string;
//   page?: number;
//   pageSize?: number;
//   searchQuery?: string;
// }

// export interface ViewQuestionParams {
//   questionId: string;
//   userId: string | undefined;
// }

// export interface JobFilterParams {
//   query: string;
//   page: string;
// }


// export interface GetQuestionByIdParams {
//   questionId: string;
// }

// export interface QuestionVoteParams {
//   questionId: string;
//   userId: string;
//   hasupVoted: boolean;
//   hasdownVoted: boolean;
//   path: string;
// }

// export interface DeleteQuestionParams {
//   questionId: string;
//   path: string;
// }

// export interface EditQuestionParams {
//   questionId: string;
//   title: string;
//   content: string;
//   path: string;
// }

// export interface GetAllTagsParams {
//   page?: number;
//   pageSize?: number;
//   filter?: string;
//   searchQuery?: string;
// }

// export interface GetQuestionsByTagIdParams {
//   tagId: string;
//   page?: number;
//   pageSize?: number;
//   searchQuery?: string;
// }

// export interface GetTopInteractedTagsParams {
//   userId: string;
//   limit?: number;
// }

export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
}

// export interface GetUserByIdParams {
//   userId: string;
// }

// export interface GetAllUsersParams {
//   page?: number;
//   pageSize?: number;
//   filter?: string;
//   searchQuery?: string; // Add searchQuery parameter
// }

export interface UpdateUserParams {
  clerkId: string;
  updateData: Partial<IUser>;
  path: string;
}

// export interface ToggleSaveQuestionParams {
//   userId: string;
//   questionId: string;
//   path: string;
// }

// export interface GetSavedQuestionsParams {
//   clerkId: string;
//   page?: number;
//   pageSize?: number;
//   filter?: string;
//   searchQuery?: string;
// }

// export interface GetUserStatsParams {
//   userId: string;
//   page?: number;
//   pageSize?: number;
// }

export interface DeleteUserParams {
  clerkId: string;
}
