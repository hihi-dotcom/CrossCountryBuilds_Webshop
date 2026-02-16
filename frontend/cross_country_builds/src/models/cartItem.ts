import type Product from "./product";

export default interface CartItem{
    id: number;
    picUrl:string,
    name: string;
    price: number;
    quantity: number;
    maker?: string;
};

