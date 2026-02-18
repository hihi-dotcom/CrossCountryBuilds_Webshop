import { useCart } from "../../components/custom_hooks/CartContext";
import { Navigate, Outlet } from "react-router-dom";

export default function CartGuard() {
  const { cartItems } = useCart();

  
  if (cartItems === undefined) return null; 


  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return <Outlet />;
}