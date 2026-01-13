import Admin_Navbar from "../../components/adminComponents/Admin_navbar";
import { Outlet } from "react-router-dom";

export default function ProtectRouteAdmin(){
    return(
        <>
            <Admin_Navbar/>
            <main className="grow bg-[#eee5e9]">
                <Outlet/>
            </main>
        </>
    );
}