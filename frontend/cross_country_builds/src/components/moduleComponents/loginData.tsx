import { FormField } from "../formFieldComponents/textField";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded"
import { useRef } from "react";
import {Link} from "react-router-dom"

export default function LoginModule(){

    const userNameRef = useRef("");
    const passwordRef = useRef("");

    return(
        <div className="flex flex-col w-full ">
            <form id="loginsection" className="flex flex-col justify-center items-center bg-transparent sm:bg-[#74171f] p-6 md:p-10 rounded-2xl mx-4 sm:mx-auto max-w-md lg:max-w-4xl mt-8 md:mt-20">
                <div className="flex flex-col md:flex-row py-7 gap-3 md:gap-8 w-full md:items-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-center">BEJELENTKEZÉS</h2>
                    <div className="flex flex-col gap-6 md:gap-9 w-full">
                        <FormField
                            input_name="felhasznalonev"
                            type="text"
                            input_id="felhasznalonev"
                            input_placeholder="felhasználónév"
                            ref={userNameRef}
                        />

                        <FormField
                            input_name="jelszo"
                            type="password"
                            input_id="jelszo"
                            input_placeholder="jelszó"
                            ref={passwordRef}
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3 text-sm">
                            <button type="submit" className=" bg-[#08415c] text-center hover:border-white border-2 border-transparent p-1 text-base md:p-2.5 md:text-base rounded-2xl w-full sm:w-auto">Bejelentkezés</button>
                            <Link to={"/getnewpass"} className=" bg-[#cc2936] hover:border-white border-2 border-transparent p-1 md:p-2.5 rounded-2xl text-base md:text-base  w-full text-center sm:w-auto">Elfelejtettem a jelszavam</Link>
                        </div>
                    </div>
                </div>
            </form>
            <div className="flex flex-col sm:flex-row items-center gap-4 mx-auto my-6 md:my-10 text-lg md:text-2xl">
                <h3 className="text-center sm:text-left">Nincs még fiókod?  Regisztrálj<ArrowRightIcon fontSize="large" className="hidden text-center sm:inline-block"/></h3>
                <Link to={"/signup"} className="bg-[#eee5e9] text-black p-3 rounded-xl hover:border-black border-4 border-transparent text-center">Regisztrálok</Link>
            </div>
        </div>
    );
}
