import Admin_Navbar from "../../components/adminComponents/Admin_navbar";
import { Outlet, Navigate, useRouteLoaderData } from "react-router-dom";

export default function ProtectRouteAdmin(){

    const user = useRouteLoaderData("admin") as {role:string} | null;

    if(!user || user.role !== "admin"){
        return <Navigate to={"/login"} replace/>
    }
    return(
        <>
            <Admin_Navbar/>
            <main className="grow bg-[#eee5e9]">
                <Outlet/>
            </main>
        </>
    );
}