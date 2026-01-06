import { createPortal } from "react-dom";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useRef } from "react";

export default function ErrorNoAuthCartModal({children}:any){

    const err_CartNoAuthdialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if(err_CartNoAuthdialogRef.current){
            err_CartNoAuthdialogRef.current.showModal();
        }
    }, []);
    return createPortal(
        <dialog className="flex flex-row bg-[#9c1f29] text-white text-lg md:text-xl xl:text-2xl rounded-2xl justify-center items-center">
            <CloseIcon/>
            <p>{children}</p>
        </dialog>,
        document.getElementById("modal-root")!
    );
}