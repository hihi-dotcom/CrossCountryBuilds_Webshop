import EndofOrderModule from "../components/moduleComponents/endofOrderModule";

import BacktoTheWebShopSection from "../components/moduleComponents/backToTheWebshop";

export default function EndofOrderPage(){
    return(
        <>
            <section>
                <EndofOrderModule/>
                <BacktoTheWebShopSection children={"Más is megtetszett? Itt visszatérhetsz a webshophoz"}/>
            </section>
        </>
    );
}