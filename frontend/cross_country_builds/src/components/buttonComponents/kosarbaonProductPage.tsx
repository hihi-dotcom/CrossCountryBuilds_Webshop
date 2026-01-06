import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function KosarbaButton(){
    return(
        <button type="button" className="bg-[#9c2b35] text-white px-3 py-3 rounded-2xl text-2xl flex items-center border-2 border-transparent hover:border-white hover:font-bold sm:px-6 sm:py-4 ">
            <ShoppingCartIcon sx={{fontSize: 30}}/> Kosárba
        </button>
    );
}