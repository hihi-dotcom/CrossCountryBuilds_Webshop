import { z } from "zod";

const myDataScheme = z.object({
    username: z.string().min(3, "A felhasználónév legalább 3 karakter kell hogy legyen."),
    email: z.email("Érvénytelen e-mail."),
    password: z.string().optional().or(z.literal("")),
    shippingAddr: z.string().min(5, "A szállítási cím kötelező!"),
    billingAddr: z.string().min(5, "A számlázási cím kötelező!"),
    sameAddress: z.boolean()
});

export default myDataScheme;