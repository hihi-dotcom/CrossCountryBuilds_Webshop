import { Navigate, Outlet, useRouteLoaderData, useLocation } from "react-router-dom";

export default function ProtectRouteUser(){
    const user = useRouteLoaderData("root") as {id:number, role:string} | null;
    const location = useLocation();

    if(!user){
        return <Navigate to={"/login"} state={{from: location.pathname}} replace/>
    }

    return <Outlet/>
}