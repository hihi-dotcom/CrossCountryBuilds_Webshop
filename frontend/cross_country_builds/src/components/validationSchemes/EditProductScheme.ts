import { z } from "zod";

export const EditProductScheme = z.object({
  name: z
    .string()
    .min(2, "A név túl rövid")
    .max(100, "A név túl hosszú"),
  category: z.string().min(1, "Kategória választása kötelező!"),
  maker: z
    .string()
    .min(1, "A gyártó megadása kötelező"),
  price: z.coerce.number()
    .min(0, "Az ár nem lehet negatív")
    .max(100000000, "Az ár túl magas"),
  stock_number: z.coerce.number()
    .min(0, "A készlet nem lehet negatív")
    .max(150, "A készlet nem lehet több 150-nél"),
});