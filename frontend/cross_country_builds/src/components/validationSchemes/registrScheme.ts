import { z } from "zod";

const registScheme = z.object({
    name: z.string().min(3, "A név minimum 3 karakter legyen!"),
    email: z.email("Rossz az e-mail cím formátuma!"),
    password: z.string().min(8, "A jelszónak legalább 8 karakterből kell állnia!"),
    confirmPassword: z.string()
}).refine(data => {data.password === data.confirmPassword},{
    message: "A jelszavak nem egyeznek!",
    path: ["confirmPassword"]
});


export default registScheme;