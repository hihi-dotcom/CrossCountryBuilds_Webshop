import { useRef } from "react";
import { FormField } from "../formFieldComponents/textField";

export default function MyDataChangeModule(){
    const felhNevRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const deliveryRef = useRef("");
    const billingRef = useRef("");

    return(
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 p-6 max-w-5xl  gap-x-14 gap-y-8 mx-auto">
                <FormField input_name="felhnev" input_id="felhnev" type="text" input_placeholder="felhasználónév" ref={felhNevRef}/>
                <FormField input_name="email" input_id="emailcim" type="email" input_placeholder="e-mail" ref={emailRef}/>
                <FormField input_name="jelszo" input_id="jelszo" type="password" input_placeholder="jelszó" ref={passwordRef}/>
                <FormField input_name="deliveryaddr" input_id="deliveryaddr" type="text" input_placeholder="szállítási cím" ref={deliveryRef}/>
                <FormField input_name="billingaddr" input_id="billingaddr" type="text" input_placeholder="számlázási cím" ref={billingRef}/> 
                <div className="w-full">
                    <div className="inline-flex items-center gap-x-3">
                        <input id="default-checkbox" type="checkbox" value="" className="w-5 h-5  border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft"/>
                        <p className="select-none ms-2 font-medium text-heading text-[20px] ">A szállítási és a számlázási cím megegyezik.</p>
                    </div>
                </div>
                <div className="flex col-span-2  mx-auto md:mr-12 justify-end">
                     <button type="submit" className="text-white bg-[#cc2936] text-xl rounded-xl py-1.5 border-2 border-transparent hover:border-white hover:font-semibold px-3 w-fit md:py-3 md:px-6">Módosítások mentése</button>
                </div>
            </div> 
        </>
    );
}