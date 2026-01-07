import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(3, "A felhasználónév megadása kötelező"),
    password: z.string().min(5, "jelszó megadása kötelező")
});

export default loginSchema;