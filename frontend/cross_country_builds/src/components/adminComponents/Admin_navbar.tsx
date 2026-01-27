import AdminLogoutButton from "./adminButtons/LogoutButtonforAdmin";
import { Form } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
export default function Admin_Navbar(){
    
    return(
        <>
            <nav className="bg-[#08415c] fixed w-full z-20 top-0 start-0 border-b border-default">
            <div className="max-w-screen-xl flex items-center justify-between mx-auto px-2 md:py-3">
                <div className="shrink-0 md:flex items-center">
                       
                        <div className="flex items-center italic font-black uppercase text-2xl">
                            <span className="text-white transition-colors duration-200 ">
                            Cross
                            </span>
                            <span className="text-[#a1202b] ml-1 transition-transform  ">
                            Country
                            </span>
                            <span className="hidden sm:flex ml-2 text-xs font-light not-italic lowercase tracking-widest text-gray-400 self-end mb-1">
                            builds
                            </span>
                        </div>
                        
                </div>
                <div className="w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-row items-center justify-end flex-1 p-4 md:p-0 md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0">
                    <li className="hidden md:flex items-center">
                        <p>Admin - Username</p>
                    </li>
                    <li>
                        <Form method="post" action="/logout">
                            <AdminLogoutButton/>
                        </Form>

                    </li>
                    <li>
                        <Form method="post" action="/logout">
                            <button type="submit" className="block md:hidden shadow-2xl  py-2 px-2 text-heading border-2 border-transparent hover:border-white   ml-auto hover:font-bold bg-[#cc2936] text-white rounded-xl"><CloseIcon className="pr-1 flex items-center"/></button>
                        </Form>
                    </li>

                </ul>
                </div>
            </div>
            </nav>

        </>
    );
}