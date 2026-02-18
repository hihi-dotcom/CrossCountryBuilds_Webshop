import { Badge, Button } from "flowbite-react";
import { HiShoppingCart, HiOutlineEye } from "react-icons/hi";
import type ProductProps from "../../models/prop_models/productProps";
import { Link } from "react-router-dom";
import { useCart } from "../custom_hooks/CartContext";
  
export function Item({ product, OnCart }: ProductProps) {
  const { addToCart } = useCart();

  return (
    <div className="w-full max-w-[18rem] justify-center bg-[#1e293b] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-full border border-gray-800 transition-transform hover:scale-[1.02]">

      <div className="relative bg-white p-5 h-56 flex items-center justify-center">
        <img
          src={`http://localhost:3000/uploads/${product.picUrl}`}
          alt={product.name}
          className="max-h-full max-w-full object-contain"
        />
        {product.stock_number <= 5 && (
          <div className="absolute top-4 right-4 z-10">
            <Badge color="warning" className="rounded-full px-3 py-1 text-[10px] font-bold shadow-md border-none">
               ⚠️ Csak {product.stock_number} maradt!
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col grow text-left">
        <div className="mb-4">
          <div className="flex justify-between items-start mb-3">
            <Badge className="bg-[#7dd3fc] text-[#0369a1] font-black text-[10px] px-2 py-0.5 rounded-md uppercase border-none">
              {product.category}
            </Badge>
            <span className="text-gray-500 text-[10px] uppercase font-bold tracking-tighter">
              {product.maker}
            </span>
          </div>
          
          <h2 className="text-white font-black text-lg leading-tight uppercase tracking-tight h-14 line-clamp-2 italic">
            {product.name}
          </h2>
        </div>

        <div className="mt-auto">
          <div className="flex items-baseline gap-1 mb-5">
            <span className="text-white text-3xl font-black tracking-tighter">
              {product.price.toLocaleString()}
            </span>
            <span className="text-gray-400 text-sm font-medium italic">Ft</span>
          </div>

          <div className="flex gap-3">
            <Link to={`/product/${product.id}`} className="flex-1">
              <button className="w-full border-2 border-white/30 text-white rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#1e293b] hover:border-white transition-all">
                Részletek
              </button>
            </Link>
            
            <button 
              onClick={() => { addToCart(product, 1); OnCart(); }}
              className="flex-1 bg-[#2563eb] text-white rounded-xl py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-[#1d4ed8] transition-all shadow-lg shadow-blue-900/40"
            >
              <HiShoppingCart className="text-sm" />
              Kosárba
            </button>
          </div>
        </div>
      </div>
    </div>

  );
}
