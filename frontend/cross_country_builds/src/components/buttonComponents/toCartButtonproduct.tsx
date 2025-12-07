import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function ToCartonProduct(){
    return(
        <button type="button" className="text-white bg-[#cc2936] p-1 sm:p-2 md:p-3 lg:p-4 border-2 border-transparent hover: border-black"><ShoppingCartIcon/>Kosárba</button>
    );
}