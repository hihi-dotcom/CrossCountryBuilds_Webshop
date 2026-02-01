
import { z } from "zod";

const createNewPassScheme = z.object({
    newjelszo: z.string().min(8, "A jelszónak minimum 8 karakterből kell állnia!"),
    newjelszo2: z.string()
}).refine(data => data.newjelszo === data.newjelszo2, {
    message: "A jelszavaknak meg kell egyezniük!",
    path: ["newjelszo2"]
});

export default createNewPassScheme;