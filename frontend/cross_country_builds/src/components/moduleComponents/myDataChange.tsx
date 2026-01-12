import { useRef } from "react";
import { Form, useActionData, useNavigation} from "react-router-dom";
import { FormField } from "../formFieldComponents/textField";

export default function MyDataChangeModule(){
    const felhNevRef = useRef("");
    const emailRef = useRef("");
    const passwordRef = useRef("");
    const deliveryRef = useRef("");
    const billingRef = useRef("");

    return(
        <>
            <Form method="patch">
                <div className="grid grid-cols-1 md:grid-cols-2 p-6 max-w-5xl  gap-x-14 gap-y-4 mx-auto">
                    <div>
                        <FormField input_name="username" input_id="felhnev" type="text" input_placeholder="felhasználónév" ref={felhNevRef}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    <div>
                        <FormField input_name="email" input_id="emailcim" type="email" input_placeholder="e-mail" ref={emailRef}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    <div>
                        <FormField input_name="password" input_id="jelszo" type="password" input_placeholder="jelszó" ref={passwordRef}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    <div>
                        <FormField input_name="shippingAddr" input_id="deliveryaddr" type="text" input_placeholder="szállítási cím" ref={deliveryRef}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    <div>
                        <FormField input_name="billingAddr" input_id="billingaddr" type="text" input_placeholder="számlázási cím" ref={billingRef}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                
                    <div className="flex col-span-2  mx-auto md:mr-12 justify-end">
                        <button type="submit" className="text-white bg-[#cc2936] text-xl rounded-xl py-1.5 border-2 border-transparent hover:border-white hover:font-semibold px-3 w-fit md:py-3 md:px-6">Módosítások mentése</button>
                    </div>
                </div> 
            </Form>

        </>
    );
}