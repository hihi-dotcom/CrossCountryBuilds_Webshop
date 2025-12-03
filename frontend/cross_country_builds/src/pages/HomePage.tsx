import { Products } from "../components/termekcomponents/termekCardSor";
import { Szurok } from "../components/szurokComponents/szurok";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";

export function Home(){
    return(
        <main> 
            <div>
                <DateTimeSection/>
            </div> 
            <div className="flex flex-col md:flex-row gap-10 px-10 py-10">
                <div>
                    <Szurok/>
                </div>
                <Products/>
            </div>
                
        </main>
    );
}