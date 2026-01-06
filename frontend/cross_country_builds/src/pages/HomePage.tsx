import { Products } from "../components/termekcomponents/termekCardSor";
import { Szurok } from "../components/szurokComponents/szurok";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";



export default function HomePage(){
    return(
    <>
        <main className="container mx-auto flex flex-col gap-10 px-5 pb-12 min-h-screen"> 
            <DateTimeSection/>
            <div className="flex flex-col lg:flex-row gap-8 items-start">  
                <div className="w-full lg:w-1/3 xl: xl:w-1/4">
                    <Szurok/>
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4 flex-1">
                    <Products/>
                </div>
            </div>
        </main>
        
    </>

    );
}