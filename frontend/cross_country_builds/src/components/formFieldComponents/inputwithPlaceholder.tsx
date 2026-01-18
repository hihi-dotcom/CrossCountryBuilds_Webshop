import type TextInputProps  from "../../models/prop_models/textInputProps";

export function TextInput({inp_type, inp_name, inp_id, inp_placeholder, inp_className, ref, OnChange}: TextInputProps){
    return(
        <input type={inp_type} name={inp_name} id={inp_id} placeholder={inp_placeholder} className={inp_className} onChange={OnChange} ref={ref}/>
    );
}