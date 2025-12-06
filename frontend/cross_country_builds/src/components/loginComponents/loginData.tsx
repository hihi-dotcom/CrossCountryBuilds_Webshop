import { FormField } from "../formFieldComponents/textField";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded"
import {Link} from "react-router-dom"

export default function LoginModule(){
    return(
        <div className="flex flex-col w-full px-4 md:max-w-full">
            <form id="loginsection" className="justify-center items-center bg-[#74171f] p-6 md:p-10 rounded-2xl mx-auto max-w-7xl mt-8 md:mt-20">
                <div className="flex flex-col lg:flex-row py-6 gap-4 md:gap-8">
                    <h1 className="flex items-center justify-center text-xl md:text-2xl font-bold whitespace-nowrap">BEJELENTKEZÉS</h1>
                    <div className="flex flex-col  gap-6 md:gap-9">
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
                        
                        <div className="flex-col sm:flex-row gap-3 text-sm">
                            <Link to={"/"} className=" bg-[#08415c] hover:border-white border-2 border-transparent p-3 text-base md:p-4 md:text-lg rounded-2xl mx-4">Bejelentkezés</Link>
                            <Link to={"/getnewpass"} className=" bg-[#cc2936] hover:border-white border-2 border-transparent p-3 md:p-4 rounded-2xl text-lg">Elfelejtettem a jelszavam</Link>
                        </div>
                    </div>
                </div>
            </form>
            <div className="flex flex-row mx-auto my-15 text-lg md:text-2xl">
                <h3 className="flex items-center justify-center">Nincs még fiókod?  Regisztrálj<ArrowRightIcon fontSize="large" className="hidden: sm:inline-block"/></h3>
                <Link to={"/signup"} className="bg-[#eee5e9] text-black p-3 rounded-xl hover:border-black border-4 border-transparent">Regisztrálok</Link>
            </div>
        </div>
    );
}
