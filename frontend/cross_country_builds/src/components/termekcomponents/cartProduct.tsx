import DeleteIcon from "@mui/icons-material/Delete";
import QuantitySelectorCart from "../quantity_components/QuantitySelectorforCart";
import type CartProductProps from "../../models/prop_models/cartProductProps";
import { useCart } from "../custom_hooks/CartContext";
import { HiTrash } from "react-icons/hi";


export default function CartProduct({ cartproduct }: CartProductProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="w-full bg-white border border-gray-100 rounded-3xl p-1 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 gap-6">
        
        <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
          <img 
            src={`http://localhost:3000/uploads/${cartproduct.picUrl}`} 
            alt={cartproduct.name} 
            className="rounded-2xl w-24 h-24 object-cover bg-gray-50 p-2 shadow-inner"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic tracking-tight">
              {cartproduct.name}
            </h2>
            <p className="text-blue-600 font-bold text-sm italic">
              {cartproduct.price.toLocaleString()} Ft / db
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 w-full sm:w-auto justify-center md:justify-end">
          <div className="bg-gray-100 p-2 rounded-2xl">
            <QuantitySelectorCart 
              quantity={cartproduct.quantity} 
              setQuantity={(newQty) => updateQuantity(cartproduct.id, newQty as number)} 
              min={1}
            />
          </div>
          
          <div className="text-right min-w-[120px]">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 italic tracking-tighter">
              {(cartproduct.price * cartproduct.quantity).toLocaleString()} Ft
            </h2>
          </div>

          <button 
            type="button" 
            className="text-gray-400 hover:text-red-600 transition-colors p-3 hover:bg-red-50 rounded-xl"
            onClick={() => removeFromCart(cartproduct.name)}
          >
            <HiTrash size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}