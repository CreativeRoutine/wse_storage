import * as z from "zod";

export const AddUserSchema = z.object({
  name: z.string().min(3).max(16),
  role: z.string().min(5),
  printers: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const productPrinterSchema = z.object({
  sn: z.string().min(5).max(12), 
  pnum: z.string().min(3).max(12),
  barcode: z.string().min(3).max(12),
  // paletSn: z.string().min(3).max(12),
})


export const addPalletSchema = z.object({
  sn: z.string().min(5).max(12),
  barcode: z.string().min(5).max(12), 
  // location: z.string().min(3).max(6),
  printers: z.array(z.string().min(1).max(15)).min(1).max(30),
  // price: z.number().min(1).max(7),
  
  // createdAt: z.string().datetime(),
  // printers:z.string().min(5).max(12), 
  // seller: z.string().min(2).max(12), 
  // price: z.number().min(1).max(12),
  // completedAt: z.string().min(3).max(12),
  // printers: z.array(z.string().min(1).max(15)).min(1).max(20),
})

export const updatePaletCostSchema = z.object({
  sn: z.string().min(5).max(12), 
  paletCost: z.string().min(1).max(7),
})

export const addPrinterSchema = z.object({
  make: z.string().min(2).max(8), 
  model: z.string().min(1).max(4),
  pnum: z.string().min(3).max(12),
  // user: z.string().min(3).max(12),
  // printers: z.array(z.string().min(1).max(15)).min(1).max(20),
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