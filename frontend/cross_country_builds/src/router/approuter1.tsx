import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./Routes";

export default function AppRouter1(){
    const router = createBrowserRouter(routes);

    return <RouterProvider router={router}/>;
}