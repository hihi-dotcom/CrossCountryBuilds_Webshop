import CloseIcon from "@mui/icons-material/Close";
export default function AdminLogoutButton(){
    return(
        <button type="submit" className=" hidden shadow-2xl md:block py-2 px-3 text-heading border-2 border-transparent hover:border-white  hover:font-bold bg-[#cc2936] text-white rounded-xl"><CloseIcon className="pr-1 flex items-center "/>Kilépés</button>
    );
}