import { useRef } from "react";
import { FormField } from "../formFieldComponents/textField";

export default function GetNewPasswordModule(){
    const emailRef = useRef("");
    return(
        <div className="flex flex-col max-w-lg mx-auto gap-6 my-20 bg-[#811d25] p-5 rounded-2xl ">
            <h2 className="text-5xl text-center font-semibold">Új jelszó kérése</h2>
            <p className="text-xl">Elfelejtetted a jelszavad? <br />Add meg az e-mail címed és elküldjük neked a jelszó visszaállító linket.</p>
            <FormField input_name="newpassword" input_id="newpassword"  type="email" input_placeholder="a te e-mail címed" ref={emailRef}/>
            <button type="submit" className="text-black py-2 px-4  bg-[#f1bf98] border-4 border-transparent hover:border-black text-2xl rounded-2xl mx-auto my-auto">Küldés</button>
        </div>
    );
}