import BackToWebShopButton from "../components/buttonComponents/backtoWebshopButton";
import { Footer } from "../components/layout/footer/footerComponent";

export default function MyDataPage(){
    return(
        <>
            <main>
                <BackToWebShopButton/>
                <h2>Saját adataim</h2>
            </main>
            <Footer/>
        </>

    );
}