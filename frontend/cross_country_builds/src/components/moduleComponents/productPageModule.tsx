import KosarbaButton from "../buttonComponents/kosarbaonProductPage";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";
import QuantitySelector from "../quantity_components/Quantity_Selector";
import { useCart } from "../custom_hooks/CartContext";
import { useState, useEffect } from "react";
import { useLoaderData, useParams} from "react-router-dom";
import IntoCartModal  from "../modalComponents/productintoCartModal";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";

export default function ProductModule(){
    const { id } = useParams();
    const [menny, setMenny] = useState(1);
    const [IsModalOpen, setIsModalOpen] = useState(false);
    const { addToCart } = useCart();

    const product = useLoaderData() as any;
    const isOutOfStock = product?.stock_number <= 0;

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
                        <span className="font-medium">A termék bekerült a kosárba!</span>
                    </IntoCartModal>
                )}
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-16 items-start mb-10">
                    <div className="w-full">
                        <img src={`http://localhost:3000/uploads/${product.picUrl}`} alt={product.name} className="w-full h-auto rounded-2xl shadow-2xl object-cover aspect-4/3"/>
                         
                        {isOutOfStock && (
                            <div className="absolute flex items-center justify-center">
                                <span className="bg-black/60 text-white px-6 py-3 rounded-b-2xl text-xl font-bold uppercase tracking-widest">Elfogyott</span>
                            </div>
                        )}
                    </div>
                   
                    <div className="flex flex-col h-full justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
                        </div>
                         <div className="h-8">
                            {isOutOfStock ? (
                                <p className="text-red-500 font-bold text-lg italic">Jelenleg nem elérhető!</p>
                            ) : product.stock_number <= 5 ? (
                                <p className="text-orange-400 font-bold text-lg ">
                                    <CheckIcon/> Készleten: {product.stock_number} darab
                                </p>
                            ) : (
                                <p className="text-green-600 font-medium">Raktáron</p>
                            )}
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
                                <p className={`text-4xl font-bold whitespace-nowrap ${isOutOfStock ? 'opacity-30' : ''}`}>{product.price * menny} Ft</p>
                                <div className={isOutOfStock ? "pointer-events-none opacity-40 flex flex-row items-center gap-x-8" : "flex flex-row items-center gap-x-8"}>
                                    <QuantitySelector quantity={menny} setQuantity={setMenny} min={1}/>
                                    <KosarbaButton OntoCart={() => {
                                        if(!isOutOfStock){
                                            addToCart(product, menny);
                                            openModal();
                                        }
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