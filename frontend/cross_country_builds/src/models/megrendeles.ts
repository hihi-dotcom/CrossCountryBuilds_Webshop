import Product from "./termek";

class Order{
    order_id!: number;
    ship_method!: string;
    pay_method!: string;
    sel_products!: Product[];
    order_status!: string;
}