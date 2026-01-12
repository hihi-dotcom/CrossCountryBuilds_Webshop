import { Item } from "./termekCard";
import bikeProducts from "./test_data";

import IntoCartModal  from "../modalComponents/productintoCartModal";

import { useState, useEffect } from 'react';

export function Products(){

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [products, setProducts] = useState(bikeProducts);

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
                    A termék bekerült a kosarába!
                </IntoCartModal>
            )}
           
            <div className="w-full">
                <div className="grid grid-cols-1  md:grid-cols-2  xl:grid-cols-3  gap-6 justify-items-center">
                    {products.map(bikeP => <Item  product={bikeP} key={bikeP.name} OnCart={() => openModal()}/>)}
                </div>
            </div>
        </section>
    );
}