import * as z from "zod";

export const AddUserSchema = z.object({
  name: z.string().min(3).max(16),
  role: z.string().min(5),
  printers: z.array(z.string().min(1).max(15)).min(1).max(3),
});
