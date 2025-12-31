import { createPortal } from "react-dom";
import { useRef, useEffect } from 'react';
import CheckIcon from "@mui/icons-material/Check"

export default function signInModal({children}: any){

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if(dialogRef.current){
            dialogRef.current.showModal()
        }
    },[])
    return createPortal(
        <dialog ref={dialogRef} className="flex inline-flex rounded-xl">
            <div><CheckIcon fontSize="large"/></div>
            <div>{children}</div>
        </dialog>,
        document.getElementById("modal-root")!
    );
}