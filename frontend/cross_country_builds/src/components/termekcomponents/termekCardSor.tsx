import { Product } from "./termekCard";
import bikeProducts from "./test_data";
import BikeImg from "../../assets/letöltés.jpg"

export function Products(){

 

    return(
        <section>
            <div className="products-section flex justify-center mt-20 md:justify-end lg:justify-end lg:p-30 overflow-auto  w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20">
                    {bikeProducts.map(bikeP => <Product kep={BikeImg} {...bikeP} key={bikeP.name}/>)}
                </div>
            </div>
        </section>
    );
}