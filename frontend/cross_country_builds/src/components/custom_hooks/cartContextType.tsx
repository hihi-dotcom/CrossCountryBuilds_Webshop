import type CartItem from "../../models/cartItem";
import type Product from "../../models/product";

export default interface CartContextType{
    cartItems: CartItem[];
    addToCart: (product:Product, quantity: number) => void;
    updateQuantity: (id:number, quantity: number) => void;
    removeFromCart: (name: string) => void;
    clearCart: () => void;
    totalPrice: number;
}