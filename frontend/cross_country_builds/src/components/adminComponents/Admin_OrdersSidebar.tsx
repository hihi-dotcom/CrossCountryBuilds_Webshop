import { Link } from "react-router-dom";
import type AdminSidebarProps from "../../models/prop_models/adminSidebarProps";

export default function AdminSidebar({link1_to, link1_innerText, link2_to, link2_innerText, link3_to, link3_innerText}:AdminSidebarProps){
    return(
        <div className="max-w-1/4 border-2 border-black px-2 py-3 mt-20 flex flex-col rounded-lg gap-3">
            <Link to={link1_to} className="bg-[#08415c] w-fit px-3 py-2 text-xl mx-auto rounded-xl hover:border-black hover:border-2 hover:font-bold ">{link1_innerText}</Link>
            <Link to={link2_to} className="bg-[#08415c] w-fit px-3 py-2 text-xl mx-auto rounded-xl hover:border-black hover:border-2 hover:font-bold">{link2_innerText}</Link>
            <Link to={link3_to} className="bg-[#08415c] w-fit px-3 py-2 text-xl mx-auto rounded-xl hover:border-black hover:border-2 hover:font-bold">{link3_innerText}</Link>
        </div>
    );
}