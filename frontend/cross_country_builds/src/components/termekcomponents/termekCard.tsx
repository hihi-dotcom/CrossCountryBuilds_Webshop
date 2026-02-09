
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import type ProductProps  from "../../models/prop_models/productProps";
import { Link } from "react-router-dom";
import superBringa from "../../assets/letöltés.jpg"
import { useCart } from "../custom_hooks/CartContext";
import { useRouteLoaderData } from "react-router-dom";



export function Item({product, OnCart}: ProductProps){
    const {addToCart} = useCart();
    const  user  = useRouteLoaderData("root") as {id:number, role:string} | null;
    const handleAddToCart = () => {
        if(user){
             addToCart(product, 1);
        }
       
        OnCart();
    }
    return(
    <>
        
        <div className="bg-neutral-primary-soft border border-default rounded-base shadow-xs w-60 rounded-lg overflow-hidden bg-[#106187] flex flex-col h-full">
            <img src={product.imageUrl} alt="Eladó termék" className="h-48 object-cover w-full "/>
            <h2 className="termekneve font-semibold my-4 mx-2">{product.name}</h2>
            <div className="termekdetails m-3">
                   <h4 className="termekkategoria text-lg">Kategória: {product.category} </h4>
                   <h4 className="termekgyarto text-lg">Gyártó: {product.maker} </h4>
                   <h2 className="termekara text-xl">{product.price} ft</h2>
            </div>
            <div className="flex px-3 gap-x-2 my-2">
                <Link to={`/product/${product.id}`}className="bg-[#08415c] text-amber-50 p-3 rounded-2xl border-transparent border-2 hover:border-white hover:font-bold">Részletek</Link>
                <button type="button" className="bg-[#cc2936] text-amber-50 p-3 rounded-2xl flex items-center mr-4 border-transparent border-2 hover:border-white hover:font-bold" id="kosarba-button" onClick={handleAddToCart}><ShoppingCartIcon/>Kosárba</button>
            </div>
        </div>
    </>
    );
}