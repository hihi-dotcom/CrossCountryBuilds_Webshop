import { z } from "zod";

export const EditAppointmentScheme = z.object({
  service_price: z.coerce.number({ error: "Az ár kötelező mező" })
    .min(0, "Az ár nem lehet negatív")
    .max(100000000, "Az ár meghaladta a maximumot"),
  
  bringback_date: z
    .string("Dátum megadása kötelező!")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Érvénytelen dátum formátum",
    })
});