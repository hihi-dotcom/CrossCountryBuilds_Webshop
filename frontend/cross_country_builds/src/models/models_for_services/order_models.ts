import type Product from "../product"

export interface OrderCreds{
    name: string, 
    email: string,
    deliveryAddr: string,
    billingAddr: string,
    payingMethod: string,
    deliveryMethod: string,
    products: Product[],
    total: number
}