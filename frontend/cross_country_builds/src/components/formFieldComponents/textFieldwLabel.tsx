interface FieldProps{
    label: string;
}

export function Field({label}: FieldProps){
    return(

        <div className="input_w_label">
            <label htmlFor="textfield" className="block">{label}</label>
            <input type="text" name="text" id="textfield" className="bg-amber-50 text-black border-black my-3"/>
        </div>
    );
}