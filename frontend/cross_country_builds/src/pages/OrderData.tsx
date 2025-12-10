import OrderSendButton from "../components/buttonComponents/orderFinishButton";
import { Footer } from "../components/layout/footer/footerComponent";

export default function OrderDataPage(){
    return(
        <>
            <main>
                <OrderSendButton/>
            </main>
            <Footer/>
        </>
    );
}