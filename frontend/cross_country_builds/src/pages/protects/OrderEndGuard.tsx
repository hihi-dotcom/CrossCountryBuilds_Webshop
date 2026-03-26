import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function OrderEndGuard(){
    const location = useLocation();
    const isValidOrder = location.state?.fromOrderProcess === true;

    if(!isValidOrder){
        return <Navigate to={"/"} replace/>
    };

    return <Outlet/>
};