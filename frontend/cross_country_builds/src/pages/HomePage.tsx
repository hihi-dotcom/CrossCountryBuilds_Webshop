import { Products } from "../components/termekcomponents/termekCardSor";
import { Szurok } from "../components/szurokComponents/szurok";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";
import { useEffect, useState, useCallback } from "react";
import ProductService from "../services/ProductService";
import { useSearchParams } from "react-router-dom";


export default function HomePage(){
    const [searchParams, setSearchParams] = useSearchParams(); 
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    const LIMIT = 15;
    /*
    const [filters, setFilters] = useState({
        name: "",
        maker:"",
        category:"",
        priceFrom:0,
        priceTo: 4000000
    });
    */
    function handleProductSearching(newFilters:any){
        setSearchParams(newFilters);
        setOffset(0);
    }

    const loadProducts = useCallback(async(currentOffset: number, append: boolean = false) => {
        setLoading(true);
        try{
            const currentFilters = Object.fromEntries(searchParams.entries());
            const result = await ProductService.getProducts(LIMIT, currentOffset, currentFilters);

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
    }, [searchParams]);

    useEffect(() => {
        setOffset(0);
        loadProducts(0, false);
    }, [searchParams, loadProducts]);

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        loadProducts(nextOffset, true);
    }

    const resetFilters = () => {
        setSearchParams({}); 
        setOffset(0);        
    };
    return(
    <>
        <section className="container mx-auto flex flex-col gap-10 px-5 pb-12 min-h-screen"> 
            <DateTimeSection/>
            <div className="flex flex-col lg:flex-row gap-8 items-start">  
                <div className="w-full lg:w-1/3 xl: xl:w-1/4 gap-5">
                    <Szurok onSearch={handleProductSearching}/>
                    <button className="w-full mt-3 py-3 px-6 border-2 border-red-600 text-red-500 font-semibold rounded-xl 
                   hover:bg-red-600 hover:text-white transition-all shadow-sm 
                    flex items-center justify-center gap-2" onClick={resetFilters}>Szűrők törlése</button>
                </div>
                <div className="w-full lg:w-2/3 xl:w-3/4 flex-1">
                    <Products filteredItems={products}/>
                    <div className="mt-12 flex flex-col gap-4  items-center justify-center w-full">
                        {hasMore &&(
                            <button onClick={handleLoadMore} disabled={loading} className="w-full max-w-sm py-3 px-6 border-2 border-[#106187] text-white font-semibold rounded-xl 
                           hover:bg-[#106187] hover:text-white transition-all shadow-sm 
                           flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? "Betöltés" : "További termékek betöltése"}
                            </button>
                        )}
                        <p className="text-white text-base">
                            Jelenleg ennyi terméket látsz: {products.length} / {total} termékből.
                        </p>
                        
                    </div>
                </div>
            </div>
        </section>
        
    </>

    );
}