import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
interface DeleteModalProps{
    isOpen: boolean;
    onClose: () => void;
    children:any
}

export default function DeleteModal({isOpen, onClose, children}:DeleteModalProps){
    const deleteRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if(!deleteRef.current){
            return;
        }
        if(isOpen){
            deleteRef.current.showModal();
        }
        else{
            deleteRef.current.close();
        }
    }, [isOpen])
    return createPortal(
        <dialog className=" bg-white text-black text-lg md:text-xl lg:text-2xl backdrop:bg-opacity-100 rounded-2xl p-6 text-center mx-auto mt-20 gap-5" ref={deleteRef} onClose={onClose}>
            <div className="block mb-5">
                <button onClick={onClose} className=" block  text-lg md:text-xl lg:text-2xl ml-auto">
                    <CloseIcon/>
                </button>
            </div>
            <div className="flex flex-col text-center gap-5 items-center justify-center">   
               {children}
            </div>
        </dialog>,
        document.getElementById("modal-root")!
    );
}