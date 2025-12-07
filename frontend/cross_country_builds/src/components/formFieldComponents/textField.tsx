import type FormFieldProps from "../../models/formfieldProps";


export function FormField({input_name, input_id, input_placeholder}: FormFieldProps){
    return(
        <input type="text" name={input_name} id={input_id} placeholder={input_placeholder}  className="bg-transparent text-xl text-white border-0 border-amber-50 border-b-2 sm:bg-amber-50 sm:text-black h-9 w-full placeholder-white sm:placeholder-black sm:rounded-lg px-4 py-5 focus:outline-none"/>
    );
}