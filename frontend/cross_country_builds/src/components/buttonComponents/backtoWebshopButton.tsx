import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function BackToWebShopButton(){
    return(
        <Link to={"/"} className="bg-[#eee5e9] flex items-center gap-2 text-lg sm:text-xl text-black rounded-lg py-3 px-3 border-2 border-transparent hover:border-black hover:font-bold transition-all shadow-md w-fit">Vissza a webshophoz <ShoppingCartIcon sx={{ fontSize: 35 }} /></Link>
    );
}