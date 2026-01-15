import type Product from "./product";

export default interface Order{
    id: number;
    ship_method: string;
    pay_method: string;
    sel_products: Product[];
    order_status: string;
}