import { z } from "zod";

const searchScheme = z.object({
    productName: z.string().optional(),
    maker: z.string().optional(),
    category: z.string().optional(),
    priceFrom: z.number().min(0).optional().nullable(),
    priceTo: z.number().min(0).optional().nullable(),
}).refine((data) => {
    if(data.priceFrom && data.priceTo){
        return data.priceTo >= data.priceFrom;
    }
    return true;
},{
    message: "A max ár nem lehet kisebb a minimumnál!",
    path:["priceTo"]
});


export default searchScheme;