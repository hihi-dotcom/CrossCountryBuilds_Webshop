interface FieldProps{
    label: string,
    name: string,
    placeholder: string
    type: string

}

export function Field({label, placeholder, type, name}: FieldProps){
    return(

        <div className="input_w_label">
            <label htmlFor="textfield" className="block text-xl py-1.5">{label}</label>
            <input type={type}  name={name} className="md:bg-amber-50 bg-transparent border-2 border-white md:text-black  placeholder:text-white md:placeholder:text-black px-1.5 py-2 rounded-xl w-full" placeholder={placeholder}/>
        </div>
    );
}