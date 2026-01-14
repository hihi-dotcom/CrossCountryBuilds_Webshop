import { Navigate, Outlet, useRouteLoaderData } from "react-router-dom";

export default function ProtectRouteUser(){
    const user = useRouteLoaderData("root") as {id:number, role:string} | null;

    if(!user){
        return <Navigate to={"/login"} replace/>
    }

    return <Outlet/>
}