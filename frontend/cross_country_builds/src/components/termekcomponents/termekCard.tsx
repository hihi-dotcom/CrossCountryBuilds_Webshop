
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import type ProductProps  from "../../models/prop_models/productProps";
import { Link } from "react-router-dom";




export function Item({kep, name, category, maker, price, OnCart}: ProductProps){
    const slug = name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
    return(
    <>
        
        <div className="bg-neutral-primary-soft block border border-default rounded-base shadow-xs w-60 rounded-lg overflow-hidden bg-[#106187]">
            <img src={kep} alt="Eladó termék"/>
            <h2 className="termekneve font-semibold my-4 mx-2">{name}</h2>
            <div className="termekdetails m-3">
                   <h4 className="termekkategoria text-lg">Kategória: {category} </h4>
                   <h4 className="termekgyarto text-lg">Gyártó: {maker} </h4>
                   <h2 className="termekara text-xl">{price} ft</h2>
            </div>
            <div className="flex px-3 gap-x-2 my-2">
                <Link to={`/product/${slug}`}className="bg-[#08415c] text-amber-50 p-3 rounded-2xl border-transparent border-2 hover:border-white hover:font-bold">Részletek</Link>
                <button type="button" className="bg-[#cc2936] text-amber-50 p-3 rounded-2xl flex items-center mr-4 border-transparent border-2 hover:border-white hover:font-bold" id="kosarba-button" onClick={OnCart}><ShoppingCartIcon/>Kosárba</button>
            </div>
        </div>
    </>
    );
}