import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


export const ProductScheme = z.object({
  name: z.string().min(3, "A termék neve legalább 3 karakter legyen!"),
  
  category: z.string().min(1, "Kategória választása kötelező!"),

  maker: z.string().min(2, "A gyártó neve legalább 2 karakter legyen!"),

  description: z.string().min(10, "A leírás legyen legalább 10 karakter!"),

  price: z.string().min(0,"Az árnak pozitív számnak kell lennie!"),

  stock_number: z.string().min(0, "A készlet nem lehet negatív!"),

  image: z.any()
    .refine((file) => file instanceof File && file.name !== "", "A termék képének feltöltése kötelező!")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "A kép mérete maximum 5MB lehet!")
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type), "Nem támogatott képformátum!"),
});

