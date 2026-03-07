import React, {createContext, useState, useEffect, useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {Toast, ToastToggle} from "flowbite-react";
import { HiCheck, HiExclamation, HiX } from "react-icons/hi";
interface ToastContextType {
  showToast: (message: string, statusCode?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({children}: {children: React.ReactNode}){
    const [toast, setToast] = useState<{id: number, msg:string, type: string}[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    const showToast = (message:string, statusCode:number = 200) => {
        const type = statusCode >= 200 && statusCode < 300 ? "success" : "error";
        const id = Date.now();

        setToast((prev) => [...prev, { id, msg: message, type }]);
    
        setTimeout(() => {
            setToast((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    };
    useEffect(() => {
        if(location.state?.toastMsg){
            showToast(location.state?.toastMsg, location.state.toastStatus || 200);

            navigate(location.pathname, {replace: true, state: {}})
        }
    },[location, navigate])
    return(
        <>
            <ToastContext.Provider value={{ showToast }}>
                {children}
                <div className={`fixed bottom-5 right-5 z-9999 flex flex-col gap-4 `}>
                    {toast.map((t) => (
                   <Toast className=" text-white border-l-4 bg-green-500/20 border-green-400 shadow-2xl w-full">
                        <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-200/10 ">
                            {t.type === "success" ? (
                            <HiCheck className="h-6 w-6" />
                            ) : (
                            <HiX className="h-6 w-6" />
                            )}
                        </div>
                        <div className="ml-4 text-sm font-black uppercase italic tracking-widest text-white">
                            {t.msg}
                        </div>
                        <ToastToggle className="ml-auto bg-transparent text-gray-400 hover:text-white hover:bg-gray-700 p-1.5" />
                    </Toast>
                    ))}
                </div>
            </ToastContext.Provider>
        </>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("A useToast-ot a Provideren belül kell használni!");
  return context;
}