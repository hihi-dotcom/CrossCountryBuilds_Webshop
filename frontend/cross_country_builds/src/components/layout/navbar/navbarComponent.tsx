import { Link } from "react-router-dom";
import LogInIcon from "@mui/icons-material/Login"
import HowtoRegIcon from "@mui/icons-material/HowToReg"

export default function Navbar(){
    return(
        <>
            <nav className="hidden sm:flex bg-[#08415c] w-full z-20 top-0  border-default items-center mr-40 px-4  h-20 mx-auto mt-10 rounded-2xl">
                <div className="hidden sm:flex gap-20  sm:ml-auto px-20">
                    <Link to="/login" className="bg-[#6b818c] px-2 py-2 rounded-lg border-black">Bejelentkezés</Link>
                    <Link to="/signup" className="bg-[#a1202b] text-center px-2 py-2 rounded-lg border-black ">Regisztrálok!</Link>
                </div>
            </nav>

            <div className="flex sm:hidden sm:bg-[#117eb1]">
                    <nav className=" w-full z-20 top-0 start-0 border-b border-default">
                    <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                        <div className="w-full md:block md:w-auto" id="navbar-default">
                        <ul className="font-bold flex flex-row p-4 md:p-0 mt-4  rounded-base justify-end space-x-14">
                            <li><Link to={"/login"}><LogInIcon fontSize="large"/></Link></li>
                            <li><Link to={"/signup"}><HowtoRegIcon fontSize="large"/></Link></li>
                        </ul>
                        </div>
                    </div>
                    </nav>

            </div>
        </>


    ); 
}