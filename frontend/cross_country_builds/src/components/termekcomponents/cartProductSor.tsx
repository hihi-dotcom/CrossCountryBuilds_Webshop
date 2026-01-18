import CartProduct from "./cartProduct";
import { useCart } from "../custom_hooks/CartContext";

import type CartProductsProps from "../../models/prop_models/cartProductsProps";
import { useState } from "react";

export default function CartProducts(){
    const {cartItems} = useCart();
    


    return(
        
            <div id="cart_goods" className="flex flex-col gap-y-4 w-full">
                {cartItems.map((cproduct) => <CartProduct cartproduct={cproduct} key={cproduct.name} />)}
            </div>
       
    );
}