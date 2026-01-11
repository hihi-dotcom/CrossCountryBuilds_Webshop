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


export default dateSchema;