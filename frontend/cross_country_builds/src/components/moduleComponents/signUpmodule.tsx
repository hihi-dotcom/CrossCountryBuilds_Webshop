import { Link } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded";
import { Footer } from "../layout/footer/footerComponent";
import { Field } from "../formFieldComponents/textFieldwLabel";

export default function SignUpModule(){
    return(
        <>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 bg-[#3a464c] py-4 w-fit mx-auto rounded-2xl ">
                <div className="w-full px-10">
                    <form className="flex flex-col gap-5 max-w-md">
                        <Field label="Add meg a neved: " placeholder="név" type="text"/>

                        <Field label="Add meg az email címed: " placeholder="e-mail" type="email"/>

                        <Field label="Adj meg egy erős jelszót: " placeholder="a te jelszavad" type="text"/>

                        <Field label="Erősítsd meg a jelszavad: " placeholder="a te jelszavad újra" type="text"/>

                        <button type="submit" className="bg-[#cc2936] text-white text-lg border-2 border-transparent hover:border-[#eee5e9] w-fit mx-auto px-9 py-3 rounded-xl">Regisztrálok!</button>

                    </form>
                </div>
                <div className="items-center place-content-center">
                    <h1>REGISZTRÁCIÓ</h1>
                    <div className="flex flex-col sm:flex-row">
                        <h3 className="text-xl text-center ">Van már fiókod? Lépj be<ArrowRightIcon sx={{fontSize: 65}}/></h3>
                        <Link to={"/signin"} className="text-black p-1.5 bg-[#eee5e9] rounded-xl sm:p-3 text-lg border-4 border-transparent hover:border-black">Belépek!</Link>
                    </div>
                </div>
                
            </div>
            
        </>
    );

}