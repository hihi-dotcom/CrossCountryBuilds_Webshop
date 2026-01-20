import AdminLogoutButton from "./adminButtons/LogoutButtonforAdmin";
import { Form } from "react-router-dom";

export default function Admin_Navbar(){
    
    return(
        <>
            <nav className="bg-[#08415c] fixed w-full z-20 top-0 start-0 border-b border-default">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className=" hidden shrink-0 md:flex items-center">
                       
                        <div className="flex items-center italic font-black uppercase text-2xl">
                            <span className="text-white transition-colors duration-200 ">
                            Cross
                            </span>
                            <span className="text-[#a1202b] ml-1 transition-transform  ">
                            Country
                            </span>
                            <span className="ml-2 text-xs font-light not-italic lowercase tracking-widest text-gray-400 self-end mb-1">
                            builds
                            </span>
                        </div>
                        
                </div>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                    <li>
                        <p>Admin - Username</p>
                    </li>
                    <li>
                        <Form method="post" action="/logout">
                            <AdminLogoutButton/>
                        </Form>
                    </li>
                </ul>
                </div>
            </div>
            </nav>

        </>
    );
}