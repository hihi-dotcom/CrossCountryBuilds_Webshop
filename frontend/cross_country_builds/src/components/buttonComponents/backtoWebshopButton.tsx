import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function BackToWebShopButton(){
    return(
        <Link to={"/"} className="bg-[#eee5e9] text-2xl text-black rounded-lg p-3 sm:p-2 md:p-3 border-2 border-transparent hover:border-black hover:font-bold">Vissza a webshophoz <ShoppingCartIcon sx={{ fontSize: 35 }} /></Link>
    );
}