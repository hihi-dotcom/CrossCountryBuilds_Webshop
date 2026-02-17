import { useRef } from "react";
import { FormField } from "../formFieldComponents/textField";
import {Form, useActionData, useNavigation} from "react-router-dom"

export default function CreateNewPasswordModule(){
    const newPasswordRef = useRef("");
    const newPassword2Ref = useRef("");
    const actionData = useActionData();
    console.log(actionData)
    return(
        <section className="flex  flex-col lg:flex-row items-center justify-center min-h-[80vh] gap-12">
            
            <div className=" hidden lg:w-1/2 md:flex justify-center lg:justify-end">
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight uppercase text-center lg:text-right">
                Új jelszó  létrehozása
                </h2>
            </div>

            <div className="sm:w-1/2 flex md:hidden justify-center">
                <h2 className="text-2xl  font-bold text-white leading-tight uppercase text-center lg:text-right">Új jelszó  létrehozása</h2>
            </div>

            
            <div className="lg:w-1/2 flex justify-center lg:justify-start">
                <Form method="post" className="w-full max-w-md   rounded-2xl">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                    <FormField 
                        input_name="newjelszo" 
                        type="password" 
                        input_id="newjelszo" 
                        input_placeholder="az új jelszavad" 
                        ref={newPasswordRef}
                    />
                    </div>

                    <div className="flex flex-col gap-2">
                    <FormField 
                        input_name="newjelszo2" 
                        type="password" 
                        input_id="newjelszo2" 
                        input_placeholder="az új jelszavad mégegyszer" 
                        ref={newPassword2Ref}
                    />
                    </div>

                    <button 
                    type="submit" 
                    className="bg-[#cc2936] text-white text-2xl rounded-2xl py-3 px-10 self-center lg:self-center border-2 border-transparent hover:border-white transition-all shadow-lg"
                    >
                    Mentés
                    </button>
                </div>
                </Form>
            </div>
            
        </section>

    );
}