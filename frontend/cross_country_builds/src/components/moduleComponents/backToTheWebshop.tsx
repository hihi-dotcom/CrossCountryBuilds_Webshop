import { Link } from "react-router-dom";
import ArrowRightIcon from "@mui/icons-material/ArrowRightAltRounded";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";

export default function BacktoTheWebShopSection(){
    return(
        <>
           <section className="mb-10">
                <div className="hidden sm:flex sm:flex-row max-w-4xl p-4 text-white bg-[#cc2936] mx-auto text-center text-xl w-fit items-center justify-center rounded-2xl mt-10 shadow-2xl">
                    <p>Más is megtetszett? Itt visszatérhetsz a webshop főoldalára <ArrowRightIcon sx={{fontSize: 50}}/></p>
                    <Link to={"/"} className="bg-[#08415c] p-3 rounded-xl">Vissza a főoldalra</Link>
                </div>

                <div className=" max-w-fit mx-auto sm:hidden">
                    <BackToWebShopButton/>
                </div>
            </section>
        </>
    );
}