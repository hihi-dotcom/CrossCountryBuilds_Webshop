import CartProduct from "./cartProduct";
import Bringa from "../../assets/letöltés.jpg"
import type CartProductsProps from "../../models/prop_models/cartProductsProps";

export default function CartProducts({cartproducts}: CartProductsProps){
    return(
        <div className="flex">
            <div id="cart_goods">
                {cartproducts.map((cproduct) => <CartProduct termek_name={cproduct.name} termek_pic={Bringa} termek_price={cproduct.price} />)}
            </div>
        </div>
    );
}