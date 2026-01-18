import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider } from "../components/custom_hooks/CartContext";
import routes from "./Routes";

export default function AppRouter1(){
    const router = createBrowserRouter(routes);

    return(
        <CartProvider>
            <RouterProvider router={router}/>
        </CartProvider>
    
);
}