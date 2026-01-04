
import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded";
import {Link, Form, useActionData, useNavigation} from "react-router-dom";
import { Field } from "../formFieldComponents/textFieldwLabel";

export default function SignUpModule(){
    return(
        <>

        <div className=" bg-transparent sm:bg-[#3a464c] rounded-2xl max-w-4xl mx-auto my-10  py-4  px-6 ">
            <div className="w-full pb-7 max-w-md mx-auto sm:hidden">
                <h1 className="mx-auto text-6xl text-white sm:hidden">REGISZTRÁCIÓ</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 ">
                <div className="w-full px-3">
                    <Form method="post" className="flex flex-col gap-5 w-full max-w-md mx-auto">
                        <Field label="Add meg a neved: " placeholder="név" type="text"/>

                        <Field label="Add meg az email címed: " placeholder="e-mail" type="email"/>

                        <Field label="Adj meg egy erős jelszót: " placeholder="a te jelszavad" type="text"/>

                        <Field label="Erősítsd meg a jelszavad: " placeholder="a te jelszavad újra" type="text"/>
                       
                    </Form>
                    
                </div>
                
                <div className=" hidden sm:flex sm:items-center sm:justify-center">
                    <h1 className="text-white text-6xl mt-20">REGISZTRÁCIÓ</h1>
                    
                </div>
            </div>
            <div className=" flex flex-col sm:flex-row items-center sm:justify-between w-full py-2 px-3 gap-6 md:gap-30">
                <button type="submit" className="bg-[#cc2936] text-white text-lg border-2 border-transparent hover:border-[#eee5e9] sm:w-fit ml-24 mt-6 px-8 py-4 rounded-xl">Regisztrálok!</button>
                <div className="flex flex-row items-center text-white "> 
                            <h3 className="text-xl">Van már fiókod? Lépj be</h3>
                            <ArrowRightIcon sx={{fontSize: 50, color: 'white'}}/>
                            <Link to={"/login"} className="text-black py-1 px-7 bg-[#eee5e9] rounded-xl text-xl border-4 border-transparent hover:border-black">Belépek!</Link>
                </div>
            </div>
            
        </div>
           
        </>
    );

}