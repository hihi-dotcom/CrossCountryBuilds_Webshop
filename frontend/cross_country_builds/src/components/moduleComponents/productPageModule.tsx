import KosarbaButton from "../buttonComponents/kosarbaonProductPage";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";
import Bigbicikli from "../../assets/letöltés.jpg";
import QuantitySelector from "../quantity_components/Quantity_Selector";
import { useCart } from "../custom_hooks/CartContext";
import { useState, useEffect } from "react";
import { useLoaderData, useParams, useRouteLoaderData } from "react-router-dom";
import biciklik from "../termekcomponents/test_data";
import IntoCartModal  from "../modalComponents/productintoCartModal";

export default function ProductModule(){
    const { id } = useParams();
    const [menny, setMenny] = useState(1);
    const [IsModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();
    const  user  = useRouteLoaderData("root") as {id:number, role:string} | null;

    const product = useLoaderData() as any;
    

    if(!id){
        return <h2>Hiba: Hiányzó termék azonosító!</h2>;
    }

    if(!product){
        return <h2>A termék nem található! (ID: {id})</h2>;
    }
    function openModal(){
        setIsModalOpen(true);
    }

    useEffect(() =>{
        const timer = setTimeout(() => {setIsModalOpen(false)}, 1500);

        return () => clearTimeout(timer);
    }, [IsModalOpen])

    useEffect(() => {})
    return(
        <section>
            <section>
                {IsModalOpen && (
                                <IntoCartModal onClose={() => setIsModalOpen(false)}>
                                    {user && <p>A termék bekerült a kosarába!</p>}
                                    {!user && (<p>Ahhoz, hogy megnézd a kosarad, be kell, hogy jelentkezz!</p>)}
                                </IntoCartModal>
                )}
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 xl:gap-16 items-start mb-10">
                    <div className="w-full">
                        <img src={`http://localhost:3000/uploads/${product.picUrl}`} alt={product.name} className="w-full h-auto rounded-2xl shadow-2xl object-cover aspect-4/3"/>
                    </div>
                   
                    <div className="flex flex-col h-full justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-2xl font-medium opacity-90">
                            <p>Gyártó: {product.maker}</p>
                            <p>Kategória: {product.category}</p>
                        </div>
                        <div className="text-base leading-relaxed opacity-80 mt-2 space-y-2">
                            <p>{product.description}</p>
                        </div>
                        <div className="mt-4 flex flex-col lg:items-end items-center  gap-8 pt-6">
                            <div className="flex flex-col flex-wrap sm:flex-row items-center justify-center gap-8 w-full lg:w-auto">
                                <p className="text-4xl font-bold whitespace-nowrap">{product.price * menny} Ft</p>
                                <div className="flex flex-row items-center gap-x-8">
                                    <QuantitySelector quantity={menny} setQuantity={setMenny} min={1}/>
                                    <KosarbaButton OntoCart={() => {
                                        addToCart(product, menny);
                                        openModal();
                                        }}/>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="flex flex-col sm:flex-row justify-center md:justify-end  items-center gap-4 mt-24">
                    <BackToWebShopButton/>
                </div>
            </section>
        </section>
    );
}