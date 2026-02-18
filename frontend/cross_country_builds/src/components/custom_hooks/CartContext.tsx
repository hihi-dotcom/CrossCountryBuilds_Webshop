import React, {createContext, useState, useEffect, useContext} from "react";
import type CartItem from "../../models/cartItem";
import type CartContextType from "./cartContextType";
import type Product from "../../models/product";




const CartContext = createContext<CartContextType | undefined>(undefined);


export const CartProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('bike-cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartValidated, setIsCartValidated] = useState(false);

    useEffect(() => {
        setIsCartValidated(false);
        localStorage.setItem('bike-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem('bike-cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product: Product, quantity: number) => {
        setCartItems((prev: CartItem[]) => {
            const exists = prev.find(item => item.id === product.id);
            if(exists){
                return prev.map(item => item.id === product.id ?
                    {...item, quantity: item.quantity + quantity} : item);
            }
            const newItem: CartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                maker: product.maker,
                quantity: quantity,
                picUrl: product.picUrl
            };
            return [...prev, newItem];
        })
    };

    const updateQuantity = (id:number, quantity:number) => {
        setCartItems((prev: CartItem[]) => 
            prev.map(item => item.id === id ?{ ...item, quantity: Math.max(1, quantity) } 
                    : item)
        );
    }

    const removeFromCart = (name: string) => {
        setCartItems(prev => prev.filter(item => item.name !== name));
    };

    const clearCart = () => setCartItems([]);

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity,0);


    return(
        <CartContext.Provider value={{cartItems, updateQuantity, addToCart, removeFromCart, clearCart, totalPrice, isCartValidated,   
        setIsCartValidated}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if(!context)
        throw new Error("A useCart hooknak benne kell lennie a CartProvider");

    return context;
}