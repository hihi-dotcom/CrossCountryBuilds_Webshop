import { Product } from "./termekCard";
import bikeProducts from "./test_data";
import BikeImg from "../../assets/letöltés.jpg"
import { Szurok } from "../szurokComponents/szurok";

export function Products(){
    return(
        <section>
            <div className="flex   md:justify-end lg:justify-end lg:p-30 overflow-auto  w-full">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 justify-center place-items-center">
                    {bikeProducts.map(bikeP => <Product kep={BikeImg} {...bikeP} key={bikeP.name}/>)}
                </div>
            </div>
        </section>
    );
}