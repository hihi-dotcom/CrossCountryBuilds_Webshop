import Product from "../models/product";

export interface OrderRespDTO{
    state: string;
    out_of_stock: Product["name"][]
}