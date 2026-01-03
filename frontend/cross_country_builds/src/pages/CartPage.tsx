import { useState } from "react";
import RendelesEndButton from "../components/buttonComponents/rendelesVegeButton";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";
import CartProducts from "../components/termekcomponents/cartProductSor";
import bikeProducts from "../components/termekcomponents/test_data";

export default function CartPage(){

    const [cartProducts, setCartProducts] = useState(bikeProducts);
    return(
    <>
        <main>
            <DateTimeSection/>
            <h2 className="text-4xl">A kosarad tartalma: </h2>
            <CartProducts cartproducts={cartProducts}/>
            <RendelesEndButton/> 
        </main>
       
    </>

    );
}