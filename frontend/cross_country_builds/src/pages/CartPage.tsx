import RendelesEndButton from "../components/buttonComponents/rendelesVegeButton";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";
import { Footer } from "../components/layout/footer/footerComponent";

export default function CartPage(){
    return(
    <>
        <main>
            <DateTimeSection/>
            <h2>A kosarad tartalma: </h2>
            <RendelesEndButton/> 
        </main>
       
    </>

    );
}