import { z } from "zod";

const orderDataScheme = z.object({
    name: z.string().min(3, "A jelszónak minimum 3 karakternek kell lennie."),
    email: z.email("Hibás e-mail cím!"),
    shippingAddr: z.string().min(5, "A szállítási cím megadása kötelező!"),
    billingAddr: z.string().min(5, "A számlázási cím megadása kötelező!"),
    paymentMethod: z.enum(["kartya-uzlet", "penz-uzlet", "futar-penz"]),
    shippingMethod: z.enum(["futar", "uzlet"]),
    sameAddress: z.boolean()

});

export default orderDataScheme;