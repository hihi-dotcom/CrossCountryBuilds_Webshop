import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function BackToWebShopButton(){
    return(
        <Link to={"/"} className="bg-[#eee5e9] text-2xl text-black rounded-lg py-3 sm:px-2 sm:py-4 md:px-3 border-2 border-transparent hover:border-black hover:font-bold">Vissza a webshophoz <ShoppingCartIcon sx={{ fontSize: 35 }} /></Link>
    );
}