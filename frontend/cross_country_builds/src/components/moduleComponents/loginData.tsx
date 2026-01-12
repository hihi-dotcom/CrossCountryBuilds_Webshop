import { FormField } from "../formFieldComponents/textField";

import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded"
import { useRef,} from "react";
import {Link, Form, useActionData, useNavigation} from "react-router-dom";

export default function LoginModule(){
    

    const userNameRef = useRef("");
    const passwordRef = useRef("");


    return(
        <div className="flex shrink-0 flex-col w-full ">
            <Form method="post" id="loginsection" className="flex flex-col justify-center items-center bg-transparent sm:bg-[#74171f]  p-6 md:p-10 rounded-2xl mx-4 my-4 sm:mx-auto max-w-md lg:max-w-4xl mt-8 md:mt-20 ">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full md:items-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-center">BEJELENTKEZÉS</h2>
                    <div className="flex flex-col gap-1 md:gap-3 w-full">
                        <FormField
                            input_name="username"
                            type="text"
                            input_id="felhasznalonev"
                            input_placeholder="felhasználónév"
                            ref={userNameRef}
                        />
                         <p className="text-red-600 text-2xl pt-3 font-semibold"></p>

                        <FormField
                            input_name="password"
                            type="password"
                            input_id="jelszo"
                            input_placeholder="jelszó"
                            ref={passwordRef}
                        />
                         <p className="text-red-600 text-2xl font-semibold"></p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 text-xl">
                            <button type="submit" className=" bg-[#08415c] text-center hover:border-white border-2 border-transparent p-2 hover:font-bold  md:p-3 md:text-xl  rounded-2xl w-full sm:w-auto">Bejelentkezés</button>
                            <Link to={"/getnewpass"} className=" bg-[#cc2936] text-center  hover:border-white border-2 border-transparent p-2 md:p-3 hover:font-bold rounded-2xl  md:text-xl  w-full sm:w-auto">Elfelejtettem a jelszavam</Link>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                        </div>
                    </div>
                </div>
            </Form>
            <div className="flex flex-col sm:flex-row items-center gap-4 mx-auto my-6 md:my-10 text-lg md:text-2xl">
                <h3 className="text-center sm:text-left">Nincs még fiókod?  Regisztrálj<ArrowRightIcon fontSize="large" className="hidden text-center sm:inline-block"/></h3>
                <Link to={"/signup"} className="bg-[#eee5e9] text-black p-3 rounded-xl hover:border-black border-4 border-transparent text-center">Regisztrálok</Link>
            </div>
        </div>
    );
}
