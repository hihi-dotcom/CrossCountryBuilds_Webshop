import { createPortal } from "react-dom";

export default function PasswordChangeModal({children}: any){
    return createPortal(
        <dialog className="inline-flex bg-[#cc2936] text-white text-lg md:text-xl lg:text-2xl backdrop:bg-opacity-200 rounded-lg p-6 text-center justify-center items-center mx-auto mt-20 gap-5">

        </dialog>,
        document.getElementById("password-change-modal")!
    );
}