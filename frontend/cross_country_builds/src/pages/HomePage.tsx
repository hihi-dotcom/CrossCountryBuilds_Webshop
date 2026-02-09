import { Products } from "../components/termekcomponents/termekCardSor";
import { Szurok } from "../components/szurokComponents/szurok";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";
import bikeProducts from "../components/termekcomponents/test_data";
import { useEffect, useState, useCallback } from "react";
import type Product from "../models/product";
import ProductService from "../services/ProductService";


export default function HomePage(){
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    const LIMIT = 15;
    const [filters, setFilters] = useState({
        name: "",
        maker:"",
        category:"",
        priceFrom:0,
        priceTo: 4000000
    });

    const loadProducts = useCallback(async(currentOffset: number, append: boolean = false) => {
        setLoading(true);
        try{
            const result = await ProductService.getProducts(LIMIT, currentOffset);

            if(result.ok){
                setTotal(result.total);
                setHasMore(result.hasMore);

                if(append){
                    setProducts((prev:any) => [...prev, ...result.products])
                }
                else{
                    setProducts(result.products);
                }
            }
        }
        catch(error){
            console.log(`Hiba a termékek betöltése közben: ${error}`)
        }
        finally{
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts(0, false);
    }, [loadProducts]);

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        loadProducts(nextOffset, true);
    }

    const filteredProducts = products.filter(p => {
   
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
        <section className="container mx-auto flex flex-col gap-10 px-5 pb-12 min-h-screen"> 
            <DateTimeSection/>
            <div className="flex flex-col lg:flex-row gap-8 items-start">  
                <div className="w-full lg:w-1/3 xl: xl:w-1/4">
                    <Szurok onSearch={setFilters}/>
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4 flex-1">
                    <Products filteredItems={filteredProducts}/>
                    <div className="mt-12 flex flex-col gap-4  items-center justify-center max-w-md">
                        {hasMore &&(
                            <button onClick={handleLoadMore} disabled={loading} className="px-10 py-5 bg-blue-700 hover:bg-blue-800 hover:font-bold text-white  rounded-lg transition-all shadow-md disabled:bg-gray-400 active:scale-95 ">
                                {loading ? "Betöltés" : "További termékek betöltése"}
                            </button>
                        )}
                        <p className="text-white text-base">
                            Jelenleg látsz: {products.length} / {total} termékből.
                        </p>
                        
                    </div>
                </div>
            </div>
        </section>
        
    </>

    );
}