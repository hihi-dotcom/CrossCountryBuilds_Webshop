import CartProduct from "./cartProduct";

import type CartProductsProps from "../../models/prop_models/cartProductsProps";
import { useState } from "react";

export default function CartProducts({cartproducts}: CartProductsProps){

    const [cItems, setcItems] = useState(cartproducts)

    function OnTorles(name: string){
       const updatedList = cItems.filter(cItem => cItem.name !== name);
       setcItems(updatedList);
    }

    if(!cItems){
        return <h1>A kosarad jelenleg üres!</h1>
    }
    return(
        
            <div id="cart_goods" className="flex flex-col gap-y-4 w-full">
                {cItems.map((cproduct) => <CartProduct cartproduct={cproduct} key={cproduct.name} OnClear={() => OnTorles(cproduct.name)} />)}
            </div>
       
    );
}