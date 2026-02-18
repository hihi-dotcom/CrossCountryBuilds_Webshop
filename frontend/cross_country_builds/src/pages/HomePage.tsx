import { Products } from "../components/termekcomponents/termekCardSor";
import { Szurok } from "../components/szurokComponents/szurok";
import { DateTimeSection } from "../components/dateTimeforpagescomponents/datetimesection";
import { useEffect, useState, useCallback } from "react";
import ProductService from "../services/ProductService";
import { useSearchParams } from "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import { HiPlusCircle } from "react-icons/hi";

export default function HomePage(){
    const [searchParams, setSearchParams] = useSearchParams(); 
    const [products, setProducts] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);

    const LIMIT = 12; 

    const loadProducts = useCallback(async(currentOffset: number, append: boolean = false) => {
        setLoading(true);
        try{
            const currentFilters = Object.fromEntries(searchParams.entries());
            const result = await ProductService.getProducts(LIMIT, currentOffset, currentFilters);

            if(result.ok){
                setTotal(result.total);
                setHasMore(result.hasMore);
                setProducts((prev:any) => append ? [...prev, ...result.products] : result.products);
            }
        } catch(error) {
            console.error("Hiba:", error);
        } finally {
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
    };
    function handleProductSearching(newFilters:any){

        setSearchParams(newFilters);

        setOffset(0);

    }
    
    return(
        <section className="container mx-auto px-4 pb-12 min-h-screen">   
            <div className="w-full">
                <DateTimeSection />
            </div>
            <div className="w-full mt-5">
                    <Szurok onSearch={handleProductSearching}/>
            </div>
          
            <div className="mt-24 w-full">
                <div className="flex justify-between items-end mb-8 border-b pb-4">
                    <h2 className="text-2xl font-black italic uppercase text-gray-800">
                        Kínálatunk <span className="text-blue-700">({total})</span>
                    </h2>
                </div>

                <Products filteredItems={products}/>
                <div className="mt-16 flex flex-col gap-6 items-center justify-center">
                    {hasMore && (
                        <Button 
                            onClick={handleLoadMore} 
                            disabled={loading} 
                            color="blue"
                            size="xl"
                            pill
                            className="px-10 shadow-xl hover:scale-105 transition-transform"
                        >
                            {loading ? <Spinner size="sm" className="mr-3" /> : <HiPlusCircle className="mr-2 h-6 w-6" />}
                            {loading ? "Betöltés..." : "Mutass többet"}
                        </Button>
                    )}
                    
                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-2">
                            Látod: <span className="font-bold">{products.length}</span> / {total} termék
                        </p>
                        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-blue-600 transition-all duration-700" 
                                style={{ width: `${(products.length / total) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}