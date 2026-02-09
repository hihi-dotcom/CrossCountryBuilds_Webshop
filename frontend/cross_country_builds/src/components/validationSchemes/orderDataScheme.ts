import { optional, z } from "zod";

const orderDataScheme = z.object({
    name: z.string().min(3, "A jelszónak minimum 3 karakternek kell lennie."),
    email: z.email("Hibás e-mail cím!"),
    shippingAddr: z.string().min(5, "A szállítási cím megadása kötelező!"),
    billingAddr: z.string().optional(),
    paymentMethod: z.enum(["kartya-uzlet", "penz-uzlet", "futar-penz"]),
    shippingMethod: z.enum(["futar", "uzlet"]),
    sameAddress: z.any().optional()
}).refine((data) => {
    const isSame = data.sameAddress === "on" || data.sameAddress === "";
    if(!isSame){
        return !!data.billingAddr && data.billingAddr.length >= 5;
    }

    return true;
}, {
    message: "A számlázási címet meg kell adni, ha az eltér a szállítástól!", 
    path: ["billingAddr"]
});

export default orderDataScheme;