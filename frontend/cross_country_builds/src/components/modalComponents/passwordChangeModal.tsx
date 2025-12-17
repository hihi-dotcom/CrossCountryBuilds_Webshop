import { createPortal } from "react-dom";
import CheckIcon from "@mui/icons-material/Check"
import { useEffect, useRef } from "react";

export default function PasswordChangeModal({children}: any){

    const p_changedialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if(p_changedialogRef.current){
            p_changedialogRef.current.showModal()
        }
    },[])
    return createPortal(
        <dialog className="inline-flex bg-[#cc2936] text-white text-lg md:text-xl lg:text-2xl backdrop:bg-opacity-200 rounded-lg p-6 text-center justify-center items-center mx-auto mt-20 gap-5">
            <div>
                <p><CheckIcon/>{children}</p>
            </div>
        </dialog>,
        document.getElementById("password-change-modal")!
    );
}