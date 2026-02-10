import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
interface AdminProductModalProps{
    isOpen: boolean;
    onClose: () => void;
    children:any
}

export default function AdminProductModal({isOpen, onClose, children}:AdminProductModalProps){

    const productsRef = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        if(!productsRef.current){
            return;
        }
        if(isOpen){
            productsRef.current.showModal();
        }
        else{
            productsRef.current.close();
        }
    }, [isOpen])
    return createPortal(
        <dialog className="bg-white text-black text-lg md:text-xl lg:text-2xl backdrop:bg-opacity-100 rounded-2xl p-6 text-center mx-auto mt-20 gap-5" ref={productsRef} onClose={onClose}>
            <div>
                <button onClick={onClose} className="block  text-lg md:text-xl lg:text-2xl ml-auto"><CloseIcon/></button>
            </div>
            <div className="flex flex-col text-center gap-5 items-center divide-black justify-center">   
               {children}
            </div>
        </dialog>,
        document.getElementById("modal-root")!
    );
}