import * as z from "zod";

// ===================  User  ===================

export const AddUserSchema = z.object({
  name: z.string().min(3).max(16),
  role: z.string().min(5),
  printers: z.array(z.string().min(1).max(15)).min(1).max(3),
});

// ===================  Pallet  ===================

export const addPalletSchema = z.object({
  ponumber: z.string().min(3).max(24),
  barcode: z.string().min(5).max(12),
  // user: z.string().min(3).max(24),
  // printers: z.array(z.string().min(1).max(15)).min(1).max(99),  
})

export const addLocationToPalletSchema = z.object({
  location: z.string().min(5).max(16),
})

export const addCostToPalletSchema = z.object({
  // price: z.number().min(2).max(8),
  price: z.number(),
})



// ===================  Printer  ===================

export const addPrinterSchema = z.object({
  sn: z.string().min(5).max(12), 
  productNumber: z.string().min(3).max(12),
  barcode: z.string().min(3).max(12),
  // paletSn: z.string().min(3).max(12),
})

export const updatePaletCostSchema = z.object({
  sn: z.string().min(5).max(12), 
  paletCost: z.string().min(1).max(7),
})

export const addPartSchema = z.object({
  name: z.string().min(2).max(12), 
  pn: z.string().min(1).max(12),
})

export const addWorkSchema = z.object({
  name: z.string().min(2).max(24), 
  // user: z.string().min(3).max(12),
  // printers: z.array(z.string().min(1).max(15)).min(1).max(20),
})

export const findPrinterBySnSchema = z.object({
  sn: z.string().min(2).max(12),
})