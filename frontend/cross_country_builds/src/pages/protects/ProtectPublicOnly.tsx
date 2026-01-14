import { Navigate, Outlet, useRouteLoaderData } from "react-router-dom";

export default function PublicOnlyRoute() {
 
    const user = useRouteLoaderData("root") as { role: string } | null;
    if (user) {
       
        if (user.role === 'admin') {
            return <Navigate to="/admin" replace />;
        }
        
        return <Navigate to="/" replace />;
    }

    
    return <Outlet />;
}