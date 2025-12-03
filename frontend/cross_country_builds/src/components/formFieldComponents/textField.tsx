import type FormFieldProps from "../../models/formfieldProps";


export function FormField({input_name, input_id, input_placeholder}: FormFieldProps){
    return(
        <input type="text" name={input_name} id={input_id} placeholder={input_placeholder}  className="bg-amber-50 text-black rounded-lg h-9"/>
    );
}