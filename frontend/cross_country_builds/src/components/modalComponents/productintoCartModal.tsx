import { createPortal } from "react-dom"
import { useRef, useEffect } from 'react'
import CheckCircleIcon from "@mui/icons-material/CheckCircle"


export default function IntoCartModal({children}: any){

    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if(dialog.current){
            dialog.current.showModal()
        }
    }, [])
    return createPortal(
        <dialog className="inline-flex bg-[#eee5e9] text-black sm:text-lg md:text-xl  backdrop:bg-opacity-200 rounded-2xl p-6 text-center justify-center items-center mx-auto mt-20 gap-5" ref={dialog}>
            <div className="chekcircle">
                <CheckCircleIcon fontSize="large"/>
            </div>
            <div className="child">
                {children}
            </div>
        </dialog>,
        document.getElementById("modal-root")!
    )
}  