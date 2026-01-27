import { z } from "zod";

const loginSchema = z.object({
    username: z.string().min(3, "A felhasználónév megadása kötelező!"),
    password: z.string().min(5, "A jelszó megadása kötelező!")
});

export default loginSchema;