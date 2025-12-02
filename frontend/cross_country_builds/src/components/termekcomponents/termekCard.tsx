import BikeImg from "../../assets/letöltés.jpg"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"

export function ProductCard(){
    return(
        <div className="bg-neutral-primary-soft block border border-default rounded-base shadow-xs w-60 rounded-lg overflow-hidden">
            <img src={BikeImg} className="h-auto" alt="Eladó termék"/>
            <h2 className="termekneve">Szexi bicikli</h2>
            <h4 className="termekkategoria">Kategória: </h4>
            <h4 className="termekgyarto">Gyártó: </h4>
            <h2 className="termekara">500.000 ft</h2>
            <div className="flex px-3 gap-x-5 my-2">
                <button type="button" className="bg-[#08415c] text-amber-50 p-3 rounded-2xl">Részletek</button>
                <button type="button" className="bg-[#cc2936] text-amber-50 p-3 rounded-2xl flex items-center mr-4"><ShoppingCartIcon/>Kosárba</button>
            </div>
        </div>

    );
}