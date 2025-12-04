import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle"

export default function Navbar(){
    return(
        
            <nav className=" flex bg-[#08415c] w-max sm:w-300 z-20 top-0  border-default items-center px-4  h-20 mx-auto mt-10 rounded-2xl">
                <div className="hidden sm:flex gap-20  sm:ml-auto px-20">
                    <Link to="/login" className="bg-[#6b818c] px-2 py-2 rounded-lg border-black">Bejelentkezés</Link>
                    <Link to="/registration" className="bg-[#a1202b] text-center px-2 py-2 rounded-lg border-black ">Regisztrálok!</Link>
                </div>

                <div className="flex sm:hidden sm:bg-[#08415c] sm:w-min">
                    <Link to={"/login"} className="text-white"><AccountCircleIcon/></Link>
                    <Link to={"/registration"} className="text-white"></Link>
                </div>
            </nav>

    ); 
}