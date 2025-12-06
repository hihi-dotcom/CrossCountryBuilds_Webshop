interface FieldProps{
    label: string,
    placeholder: string

}

export function Field({label, placeholder}: FieldProps){
    return(

        <div className="input_w_label">
            <label htmlFor="textfield" className="block">{label}</label>
            <input type="text" name="text" id="textfield" className="bg-amber-50 text-black border-black my-3 placeholder:text-black" placeholder={placeholder}/>
        </div>
    );
}