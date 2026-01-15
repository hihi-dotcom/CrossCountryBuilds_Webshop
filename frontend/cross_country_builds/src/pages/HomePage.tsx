import { Products } from "../components/termekcomponents/termekCardSor";
import { Szurok } from "../components/szurokComponents/szurok";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";
import bikeProducts from "../components/termekcomponents/test_data";
import { useState } from "react";


export default function HomePage(){
    const [filters, setFilters] = useState({
        name: "",
        maker:"",
        category:"",
        priceFrom:0,
        priceTo: 4000000
    });

    const filteredProducts = bikeProducts.filter(p => {
   
        const matchName = filters.name === "" || 
           p.name.toLowerCase().includes(filters.name.toLowerCase());

        const matchMaker = filters.maker === "" ||  
          p.maker.toLowerCase().includes(filters.maker.toLowerCase());
        
        const matchCategory = filters.category === "" ||
          p.category === filters.category;
        
        const matchPrice = p.price >= (filters.priceFrom || 0) &&
                           p.price <= (filters.priceTo || 4000000);

        return matchName && matchMaker && matchCategory && matchPrice;
    });
    return(
    <>
        <main className="container mx-auto flex flex-col gap-10 px-5 pb-12 min-h-screen"> 
            <DateTimeSection/>
            <div className="flex flex-col lg:flex-row gap-8 items-start">  
                <div className="w-full lg:w-1/3 xl: xl:w-1/4">
                    <Szurok onSearch={setFilters}/>
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4 flex-1">
                    <Products filteredItems={filteredProducts}/>
                </div>
            </div>
        </main>
        
    </>

    );
}