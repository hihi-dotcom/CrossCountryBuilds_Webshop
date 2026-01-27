import type FormFieldProps from "../../models/prop_models/formfieldProps";
import { forwardRef } from "react";


export function OrderField({input_name, input_id, type,input_placeholder, ref}: FormFieldProps){
    return(
        <>
            <input type={type} name={input_name} id={input_id} placeholder={input_placeholder}  className="bg-transparent text-xl text-white rounded-lg border-amber-50 border-2 sm:bg-amber-50 sm:text-black h-9 w-full placeholder-white sm:placeholder-black sm:rounded-lg px-4 py-5 focus:outline-none" ref={ref}/>
        </>
    );
}