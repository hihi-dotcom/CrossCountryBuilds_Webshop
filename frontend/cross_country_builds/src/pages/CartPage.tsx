import RendelesEndButton from "../components/buttonComponents/rendelesVegeButton";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";

export default function CartPage(){
    return(
        <main>
            <DateTimeSection/>
            <h2>A kosarad tartalma: </h2>
            <RendelesEndButton/>
        </main>
    );
}