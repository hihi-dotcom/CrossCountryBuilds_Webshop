import { useState } from "react";
import RendelesEndButton from "../components/buttonComponents/rendelesVegeButton";
import CartProducts from "../components/termekcomponents/cartProductSor";
import bikeProducts from "../components/termekcomponents/test_data";
import BacktoTheWebShopSection from "../components/moduleComponents/backToTheWebshop";

export default function CartPage(){

    const [cartProducts, setCartProducts] = useState(bikeProducts);
    return(
    <>
        <main className="min-h-screen py-10 px-12 ">
            <BacktoTheWebShopSection children={"Elfelejtettél valamit? Itt még visszatérhetsz a webshophoz"}/>
            <div className="flex flex-col max-w-4xl mx-start gap-y-8">
                <h2 className="text-4xl font-medium mb-3">A kosarad tartalma: </h2>
                <CartProducts cartproducts={cartProducts.map(p => ({ name: p.name, pic: '', price: p.price }))}/>
            </div>
            
            <div className="w-full max-w-5xl mx-auto flex justify-center sm:justify-end mt-4">
                <div className="cursor-pointer duration-200 transition-colors">
                    <RendelesEndButton/>
                </div>
            </div>
             
        </main>
       
    </>

    );
}