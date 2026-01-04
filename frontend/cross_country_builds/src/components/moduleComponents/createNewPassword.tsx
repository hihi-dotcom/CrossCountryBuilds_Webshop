import { useRef } from "react";
import { FormField } from "../formFieldComponents/textField";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";
import {Form, useActionData, useNavigation} from "react-router-dom"

export default function CreateNewPasswordModule(){
    const newPasswordRef = useRef("");
    const newPassword2Ref = useRef("");
    return(
        <main className="flex flex-col sm:flex-row gap-4 sm:gap-44">
            <Form method="post">
                <h2 className="text-4xl mt-6 mx-auto sm:hidden">Új jelszó létrehozása</h2>
                <div className="flex flex-col max-w-md sm:ml-40 w-full my-2 sm:my-20 gap-14 sm:gap-6 px-2">
                    <FormField input_name="newjelszo" type="password" input_id="newjelszo" input_placeholder="az új jelszavad" ref={newPasswordRef}/>
                    <FormField input_name="newjelszo2" type="password" input_id="newjelszo2" input_placeholder="az új jelszavad mégegyszer" ref={newPassword2Ref}/>

                    <button type="submit" className="bg-[#cc2936] text-white text-2xl rounded-2xl mx-auto py-2.5 px-7 border-2 border-transparent hover:border-white hover:font-semibold">Mentés</button>
                </div>
                <div className="sm:hidden mx-auto">
                <BackToWebShopButton/>     
                </div>
                <div className=" hidden sm:flex sm:flex-col items-center justify-center">
                    <h1>Új jelszó létrehozása</h1>
                </div>
            </Form>
        </main>

    );
}