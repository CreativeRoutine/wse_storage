import { get } from "http";
import * as z from "zod";

// ===================  User  ===================

export const AddUserSchema = z.object({
  name: z.string().min(3).max(16),
  role: z.string().min(5),
  printers: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const ChangeUserDepartmentSchema = z.object({
  department: z.string().min(3).max(16).trim(),
});
export const ChangeUserAdminSchema = z.object({
  admin: z.boolean(),
});

export const AddEmployeeSchema = z.object({
  name: z.string().min(3).max(30),
  lastName: z.string().min(3).max(30),
  nickName: z.string().min(3).max(30),
});

export const ChangeUserSupervisorSchema = z.object({
  supervisor: z.boolean(),
});

export const userSearchSchema = z.object({
  userName: z.string().min(0).max(30),
  id: z.string().min(0).max(30),
})

// ===================  Pallet  ===================

export const addPalletSchema = z.object({
  ponumber: z.string().min(3).max(30),
  barcode: z.string().min(5).max(30),
  // user: z.string().min(3).max(24),
  // printers: z.array(z.string().min(1).max(15)).min(1).max(99),  
})

export const addLocationToPalletSchema = z.object({
  location: z.string().min(0).max(16),
})

export const addCostToPalletSchema = z.object({
  price: z.string().min(0).max(7),
})

export const deletePalletSchema = z.object({
  id: z.string().min(5).max(12),
})



// ===================  Printer  ===================

export const addPrinterSchema = z.object({
  ponumber: z.string().min(0).max(30),
  sn: z.string().min(5).max(30), 
  productNumber: z.string().min(3).max(30),
  barcode: z.string().min(3).max(30),
  // paletSn: z.string().min(3).max(12),
})

export const findPrinterSchema = z.object({
  barcode: z.string().min(0).max(30),
})

export const printerSearchSchema = z.object({
  printer: z.string().min(0).max(30),
})
export const printerWorkerNameSchema = z.object({
  techName: z.string().min(0).max(30),
})

export const addPrinterToPalletSchema = z.object({
  sn: z.string().min(5).max(30), 
  productNumber: z.string().min(3).max(30),
  barcode: z.string().min(3).max(30),
})

export const deletePrinterSchema = z.object({
  id: z.string().min(5).max(30),
})

export const unPinPrinterSchema = z.object({
  id: z.string().min(5).max(30),
  printerId: z.string().min(5).max(30),
})

export const pinToPalletSchema = z.object({
  id: z.string().min(5).max(20),
  palletBarcode: z.string().min(5).max(30),
})

export const updatePaletCostSchema = z.object({
  sn: z.string().min(5).max(12), 
  paletCost: z.string().min(1).max(7),
})

export const updatePrinterPONSchema = z.object({
  ponumber: z.string().min(0).max(30),
})

export const addPartSchema = z.object({
  name: z.string().min(2).max(30), 
  pn: z.string().min(1).max(30),
})

export const addWorkSchema = z.object({
  name: z.string().min(2).max(30), 
  // user: z.string().min(3).max(12),
  // printers: z.array(z.string().min(1).max(15)).min(1).max(20),
})

export const findPrinterBySnSchema = z.object({
  sn: z.string().min(2).max(30),
})

// ===================  Supplier  ===================
export const updateSuppliersName = z.object({
  name: z.string().min(0).max(30),
})
export const deleteSupplierSchema = z.object({
  _id: z.string().min(2).max(30),
})

// ===================  Make  ===================
export const updateMakeName = z.object({
  name: z.string().min(0).max(30),
})
export const deleteMakeSchema = z.object({
  _id: z.string().min(2).max(30),
})