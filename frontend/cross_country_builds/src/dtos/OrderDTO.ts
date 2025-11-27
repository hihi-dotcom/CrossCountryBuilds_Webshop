import Product from "../models/product";

export interface OrderDTO{
    products: Product[],
    ship_method: string,
    pay_method: string
}