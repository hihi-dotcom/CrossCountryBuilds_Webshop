import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import type ProductProps  from "../../models/prop_models/productProps";
import { Link } from "react-router-dom";
import { useCart } from "../custom_hooks/CartContext";



export function Item({product, OnCart}: ProductProps){
    const {addToCart} = useCart();

    const handleAddToCart = () => {
       
        addToCart(product, 1);
        OnCart();
    }
    return(
    <>
        
        <div className="bg-neutral-primary-soft border border-default rounded-base  w-60 rounded-lg overflow-hidden bg-[#106187] flex flex-col h-full shadow-2xl">
            <img src={`http://localhost:3000/uploads/${product.picUrl}`} alt="Eladó termék" className="h-48 object-cover w-full "/>
            <div className="flex flex-col grow justify-start p-3">
                    <div>
                        <h2 className="termekneve font-semibold text-lg mb-2 text-white leading-tight h-12">{product.name}</h2>
                        <h4 className="termekkategoria opacity-90 text-lg">Kategória: {product.category} </h4>
                        <h4 className="termekgyarto  opacity-90 text-lg">Gyártó: {product.maker} </h4>
                    </div>

                    
                   <div className="mt-auto">
                    <h2 className="termekara text-3xl font-bold">{product.price.toLocaleString()} Ft</h2>
                    <div className="h-6"> 
                        {product.stock_number <= 5 && (
                            <h4 className="text-orange-500 font-medium text-base italic">
                                Már csak {product.stock_number} maradt!
                            </h4>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex px-3 gap-x-2 my-2">
                <Link to={`/product/${product.id}`}className="bg-[#08415c] text-amber-50 p-3 rounded-2xl border-transparent border-2 hover:border-white hover:font-bold flex-1">Részletek</Link>
                <button type="button" className="bg-[#cc2936] text-amber-50 p-3 rounded-2xl flex items-center mr-4 border-transparent border-2 hover:border-white hover:font-bold flex-1" id="kosarba-button" onClick={handleAddToCart}><ShoppingCartIcon/>Kosárba</button>
            </div>
        </div>
    </>
    );
}