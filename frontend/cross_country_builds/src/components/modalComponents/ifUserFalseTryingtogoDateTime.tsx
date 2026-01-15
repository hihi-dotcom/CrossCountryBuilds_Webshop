import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";



export default function IfUserFalseNotDateTime({children}:any){
    const trytoAppointmentRef = useRef<HTMLDialogElement>(null);
    
        useEffect(() => {
            if(trytoAppointmentRef.current){
                trytoAppointmentRef.current.showModal()
            }
        },[])
    return createPortal(
        <dialog className="inline-flex bg-[#cc2936] text-white text-lg md:text-xl lg:text-2xl backdrop:bg-opacity-100 rounded-2xl p-6 text-center justify-center items-center mx-auto mt-20 gap-5" ref={trytoAppointmentRef}>
            <>
                {children}
            </>
        </dialog>,
        document.getElementById("modal-root")!
    );
}