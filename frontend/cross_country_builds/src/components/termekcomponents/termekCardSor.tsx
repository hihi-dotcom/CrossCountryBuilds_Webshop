import { Item } from "./termekCard";

import type Product from "../../models/product";
import IntoCartModal  from "../modalComponents/productintoCartModal";

import { useState, useEffect } from 'react';
import { useRouteLoaderData } from "react-router-dom";
export function Products({filteredItems}: {filteredItems: Product[]}){

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const displayProducts = filteredItems;
    const  user  = useRouteLoaderData("root") as {id:number, role:string} | null;

    function openModal(){
        setModalIsOpen(true);
    }

    useEffect(() =>{
        const timer = setTimeout(() => {setModalIsOpen(false)}, 1500);

        return () => clearTimeout(timer);
    }, [modalIsOpen])

    return(
        
        <section className="w-full h-full">
            {modalIsOpen && (
                <IntoCartModal onClose={() => setModalIsOpen(false)}>
                    {user && <p>A termék bekerült a kosarába!</p>}
                    {!user && (<p>Ahhoz, hogy megnézd a kosarad, be kell, hogy jelentkezz!</p>)}
                </IntoCartModal>
            )}
           
            <div className="w-full">
                <div className="grid grid-cols-1  md:grid-cols-2  xl:grid-cols-3  gap-6 justify-items-center items-stretch">
                    {displayProducts.map(bikeP => <Item  product={bikeP} key={bikeP.id} OnCart={() => openModal()}/>)}
                </div>
            </div>
            {displayProducts.length === 0 && (
                    <p className="text-white text-center text-2xl mt-10">Nincs a keresésnek megfelelő termék.</p>
                )}
        </section>
    );
}