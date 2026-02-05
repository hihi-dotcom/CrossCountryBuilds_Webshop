import type CartItem from "../cartItem"


export interface OrderCreds{
    name: string, 
    email: string,
    deliveryAddr: string,
    billingAddr: string,
    payingMethod: string,
    deliveryMethod: string,
    products: CartItem[],
    total: number
}

export interface UpdateStatCreds{
    status: string
}