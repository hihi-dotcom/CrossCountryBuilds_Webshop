import EndofOrderModule from "../components/moduleComponents/endofOrderModule";
import { useEffect } from "react";
import BacktoTheWebShopSection from "../components/moduleComponents/backToTheWebshop";
import { useCart } from "../components/custom_hooks/CartContext";

export default function EndofOrderPage(){
    const { clearCart } = useCart()

    useEffect(() => {clearCart()}, []);

    return(
        <>
            <section>
                <EndofOrderModule/>
                <BacktoTheWebShopSection children={"Más is megtetszett? Itt visszatérhetsz a webshophoz"}/>
            </section>
        </>
    );
}