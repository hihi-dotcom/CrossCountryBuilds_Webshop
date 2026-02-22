import { z } from "zod";

const orderDataScheme = z.object({
    name: z.string().min(3, "A név kitöltése kötelező (min. 3 karakter)."),
    // Szállítási cím - MINDIG KÖTELEZŐ
    shippingzipCode: z.string().min(4, "irányítószám kötelező").max(4, "4 számjegy"),
    shippingcityName: z.string().min(2, "Város kötelező"),
    shippingstreetName: z.string().min(3, "Utca kötelező"),
    shippinghouseNumber: z.string().min(1, "Házszám kötelező"),

    // Számlázási cím - Alapból stringként definiáljuk
    billingzipCode: z.string().default(""),
    billingcityName: z.string().default(""),
    billingstreetName: z.string().default(""),
    billinghouseNumber: z.string().default(""),

    paymentMethod: z.string().min(1, "Válassz fizetési módot!"),
    shippingMethod: z.string().min(1, "Válassz szállítási módot!"),
    sameAddress: z.string().optional(),
    
    // Segédadatok a formból
    userId: z.string().optional()
}).superRefine((data, ctx) => {
    // Ha NINCS bepipálva a "megegyezik" checkbox
    if (data.sameAddress !== "on") {
        if (data.billingzipCode.length < 4) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Irsz. kötelező", path: ["deliveryZip"] });
        }
        if (data.billingcityName.length < 2) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Város kötelező", path: ["deliveryCity"] });
        }
        if (data.billingstreetName.length < 3) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Utca kötelező", path: ["deliveryStreet"] });
        }
        if (data. billinghouseNumber.length < 1) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Házszám kötelező", path: ["deliveryHouseNum"] });
        }
    }
});

export default orderDataScheme;