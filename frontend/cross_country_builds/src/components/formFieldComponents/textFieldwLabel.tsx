interface FieldProps{
    label: string,
    placeholder: string
    type: string

}

export function Field({label, placeholder, type}: FieldProps){
    return(

        <div className="input_w_label">
            <label htmlFor="textfield" className="block text-xl py-1.5">{label}</label>
            <input type={type} className="bg-amber-50 text-black border-black placeholder:text-black px-1.5 py-2 rounded-xl w-full" placeholder={placeholder}/>
        </div>
    );
}