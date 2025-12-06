
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import type ProductProps  from "../../models/productProps";




export function Product({kep, name, category, maker, price, OnCart}: ProductProps){



    return(
    <>
        
        <div className="bg-neutral-primary-soft block border border-default rounded-base shadow-xs w-60 rounded-lg overflow-hidden bg-[#106187]">
            <img src={kep} alt="Eladó termék"/>
            <h2 className="termekneve font-semibold my-4 mx-2">{name}</h2>
            <div className="termekdetails m-3">
                   <h4 className="termekkategoria">Kategória: {category} </h4>
                   <h4 className="termekgyarto">Gyártó: {maker} </h4>
                   <h2 className="termekara">{price} ft</h2>
            </div>
            <div className="flex px-3 gap-x-5 my-2">
                <button type="button" className="bg-[#08415c] text-amber-50 p-3 rounded-2xl">Részletek</button>
                <button type="button" className="bg-[#cc2936] text-amber-50 p-3 rounded-2xl flex items-center mr-4" id="kosarba-button" onClick={OnCart}><ShoppingCartIcon/>Kosárba</button>
            </div>
        </div>
    </>
    );
}