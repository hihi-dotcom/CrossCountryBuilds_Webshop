import type Product from "./product";

export default interface Order{
    u_id?: number;
    deliveryAddr?:{
        zipCode: string,
        cityName:string,
        streetName:string,
        houseNumber:number
    },
    billingAddr?:{
        zipCode: string,
        cityName:string,
        streetName:string,
        houseNumber:number
    },
    pMethod?: string,
    dMethod?:string,
    total_amount?: number,
    products?: Product[]
}