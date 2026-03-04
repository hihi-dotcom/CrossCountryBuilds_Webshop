import { z } from "zod";

const dateSchema = (validTimes: any) => {
    return z.object({
        appointmentDate: z.string().refine(
            (val) => validTimes.includes(val),
            {message: "Kérjük válassz egy érvényes időpontot a listából!"}
        ),
        message: z.string()
            .min(30, "Kérjük, írd le kicsit bővebben a problémát (min. 30 karakter hosszan).")
            .max(500, "A leírás túl hosszú lett!")
    })
}


export const AppointmentSchema = z.object({
  appointmentDate: z.string()
    .min(1, "A dátum megadása kötelező!")
    .refine((val) => {
      const selectedDate = new Date(val);
      const now = new Date();
      return selectedDate > now;
    }, {
      message: "A kiválasztott időpont nem lehet a múltban",
    }),
});



export default dateSchema;
