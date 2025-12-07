import { FormField } from "../formFieldComponents/textField";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded"
import {Link} from "react-router-dom"

export default function LoginModule(){
    return(
        <div className="flex flex-col w-full ">
            <form id="loginsection" className="flex flex-col justify-center items-center bg-transparent sm:bg-[#74171f] p-6 md:p-10 rounded-2xl mx-4 sm:mx-auto max-w-md lg:max-w-4xl mt-8 md:mt-20">
                <div className="flex flex-col md:flex-row py-7 gap-3 md:gap-8 w-full md:items-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-center">BEJELENTKEZÉS</h2>
                    <div className="flex flex-col gap-6 md:gap-9 w-full">
                        <FormField
                            input_name="felhasznalonev"
                            input_id="felhasznalonev"
                            input_placeholder="felhasználónév"
                        />

                        <FormField
                            input_name="jelszo"
                            input_id="jelszo"
                            input_placeholder="jelszó"
                        />
                        
                        <div className="flex flex-col sm:flex-row gap-3 text-sm">
                            <Link to={"/"} className=" bg-[#08415c] text-center hover:border-white border-2 border-transparent p-3 text-base md:p-4 md:text-lg rounded-2xl w-full sm:w-auto">Bejelentkezés</Link>
                            <Link to={"/getnewpass"} className=" bg-[#cc2936] hover:border-white border-2 border-transparent p-3 md:p-4 rounded-2xl text-base md:text-lg w-full text-center sm:w-auto">Elfelejtettem a jelszavam</Link>
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
