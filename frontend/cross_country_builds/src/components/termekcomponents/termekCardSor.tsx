import { Product } from "./termekCard";
import bikeProducts from "./test_data";
import BikeImg from "../../assets/letöltés.jpg"

import IntoCartModal  from "../modalComponents/productintoCartModal";

import { useState, useEffect } from 'react';

export function Products(){

    const [modalIsOpen, setModalIsOpen] = useState(false);

    function openModal(){
        setModalIsOpen(true);
    }

    useEffect(() =>{
        const timer = setTimeout(() => {setModalIsOpen(false)}, 1500);

        return () => clearTimeout(timer);
    }, [modalIsOpen])

    return(
        
        <section>
            {modalIsOpen && (
                <IntoCartModal onClose={() => setModalIsOpen(false)}>
                    A termék bekerült a kosarába!
                </IntoCartModal>
            )}
           
            <div className="flex   md:justify-end lg:justify-end lg:p-30 overflow-auto  w-full">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 flex-1 justify-center place-items-center">
                    {bikeProducts.map(bikeP => <Product kep={BikeImg} {...bikeP} key={bikeP.name} OnCart={() => openModal()}/>)}
                </div>
            </div>
        </section>
    );
}