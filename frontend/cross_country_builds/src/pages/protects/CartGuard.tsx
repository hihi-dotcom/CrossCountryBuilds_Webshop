import { Navigate, Outlet } from "react-router-dom";
import { useCart } from "../../components/custom_hooks/CartContext";


export default function CartGuard(){
    const { cartItems, isCartValidated } = useCart(); 
  
    if(!cartItems || cartItems.length === 0 || !isCartValidated){
        return <Navigate to="/cart" replace />
    }

    return <Outlet />;
}