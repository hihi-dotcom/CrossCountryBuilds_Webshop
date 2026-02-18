import { Item } from "./termekCard";
import type Product from "../../models/product";
import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiCheck, HiExclamation } from "react-icons/hi";

export function Products({ filteredItems }: { filteredItems: Product[] }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    if (modalIsOpen) {
      const timer = setTimeout(() => { setModalIsOpen(false) }, 1500);
      return () => clearTimeout(timer);
    }
  }, [modalIsOpen]);

  return (
    <section className="w-full py-4">
     
      <Modal show={modalIsOpen} size="sm" onClose={() => setModalIsOpen(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiCheck className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <h3 className="mb-5 text-lg font-bold text-white italic uppercase">
              Bekerült a kosárba!
            </h3>
          </div>
        </ModalBody>
      </Modal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {filteredItems.map(bikeP => (
          <Item product={bikeP} key={bikeP.id} OnCart={() => setModalIsOpen(true)} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200 mt-10 shadow-inner">
           <HiExclamation className="h-16 w-16 text-gray-300 mb-4" />
           <p className="text-gray-500 text-xl font-bold uppercase italic tracking-widest">Nincs találat</p>
           <p className="text-gray-400 text-sm mt-2">Próbálj meg más szűrési feltételeket megadni.</p>
        </div>
      )}
    </section>
  );
}