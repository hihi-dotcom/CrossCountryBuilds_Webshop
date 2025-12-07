import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function BackToWebShopButton(){
    return(
        <Link to={"/"} className="bg-[#eee5e9] text-black rounded-lg p-1 sm:p-2 md:p-3">Vissza a webshophoz <ShoppingCartIcon/></Link>
    );
}