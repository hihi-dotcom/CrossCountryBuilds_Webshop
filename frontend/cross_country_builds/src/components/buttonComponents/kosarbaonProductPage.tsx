import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export default function KosarbaButton(){
    return(
        <button type="button" className="bg-[#9c2b35] text-white p-3 rounded-2xl text-2xl flex items-center ">
            <ShoppingCartIcon sx={{fontSize: 30}}/> Kosárba
        </button>
    );
}