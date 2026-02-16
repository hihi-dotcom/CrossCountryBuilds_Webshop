import DeleteIcon from "@mui/icons-material/Delete";
import QuantitySelectorCart from "../quantity_components/QuantitySelectorforCart";
import type CartProductProps from "../../models/prop_models/cartProductProps";
import { useCart } from "../custom_hooks/CartContext";


export default function CartProduct({cartproduct}: CartProductProps){
    const { updateQuantity, removeFromCart} = useCart();
    

    return(
        <div className="w-full bg-[#f1bf98] rounded-2xl">
            <div className="flex  flex-col md:flex-row items-center justify-between rounded-xl p-4 sm:px-6 w-full shadow-md gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left  ">
                    <img src={`http://localhost:3000/uploads/${cartproduct.picUrl}`} alt="termék képe" className="rounded-full shrink-0 w-20 h-auto object-cover"/>
                    <h2 className="text-xl sm:text-2xl font-bold text-black wrap-break-word">{cartproduct.name}</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end">
                    <h2 className="text-2xl sm:text-3xl font-bold whitespace-nowrap text-black">{cartproduct.price * cartproduct.quantity} Ft</h2>
                    <QuantitySelectorCart quantity={cartproduct.quantity} setQuantity={(newQty) => updateQuantity(cartproduct.id, newQty as number)} min={1}/>
                    <button type="button" className="hover:text-red-600 p-2" onClick={() => removeFromCart(cartproduct.name)} ><DeleteIcon className="text-black"  sx={{fontSize: 40}}/></button>
                </div>
                    
                
            </div>
        </div>
    );
}