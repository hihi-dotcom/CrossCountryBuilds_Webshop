import { useState } from "react";
import { useCart } from "../components/custom_hooks/CartContext";
import RendelesEndButton from "../components/buttonComponents/rendelesVegeButton";
import CartProducts from "../components/termekcomponents/cartProductSor";
import bikeProducts from "../components/termekcomponents/test_data";
import BacktoTheWebShopSection from "../components/moduleComponents/backToTheWebshop";

export default function CartPage(){
    const {cartItems} = useCart();

    const hasItems = cartItems && cartItems.length > 0;
    return(
    <>
        <main className="min-h-screen py-10 px-12 ">
            <BacktoTheWebShopSection children={"Elfelejtettél valamit? Itt még visszatérhetsz a webshophoz"}/>
            <div className="flex flex-col max-w-4xl mx-start gap-y-8">
                <h2 className="text-4xl font-medium mb-3">A kosarad tartalma: </h2>
                <CartProducts/>
            </div>
            
            <div className="w-full max-w-5xl mx-auto flex justify-center sm:justify-end mt-4">
                
                    {hasItems ? (
                        <div className="cursor-pointer duration-200 transition-colors">
                            <RendelesEndButton/>
                        </div>
                    ) : (  
                    <>
                        <div className="py-10 text-center justify-center w-full items-center text-white">
                            <h1 className="text-2xl font-bold">A kosarad jelenleg üres!</h1>
                            <p className="text-xl"> Válassz valamit a webshopban, a fentebbi gombbal tudsz visszatérni!</p>
                        </div>
                    </>            

            )}
                </div>
          
             
        </main>
       
    </>

    );
}