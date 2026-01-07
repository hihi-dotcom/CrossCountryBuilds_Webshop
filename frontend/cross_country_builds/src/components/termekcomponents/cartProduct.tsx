import DeleteIcon from "@mui/icons-material/Delete";
import QuantitySelectorCart from "../quantity_components/QuantitySelectorforCart";
import type CartProductProps from "../../models/prop_models/cartProductProps";
import { useState } from "react";

export default function CartProduct({termek_name, termek_pic,termek_price}: CartProductProps){
    const [quan, setQuan]  = useState(1);

    return(
        <div className="w-full bg-[#f1bf98] rounded-2xl">
            <div className="flex  flex-col sm:flex-row items-center justify-between rounded-xl p-4 sm:px-6 w-full shadow-md gap-4 sm:gap-0">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto text-center sm:text-left  ">
                    <img src={termek_pic} alt="termék képe" className="rounded-full shrink-0 w-20 h-auto object-cover"/>
                    <h2 className="text-xl sm:text-2xl font-bold text-black wrap-break-word">{termek_name}</h2>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto justify-center sm:justify-end">
                    <h2 className="text-2xl sm:text-3xl font-bold whitespace-nowrap text-black">{termek_price} Ft</h2>
                    <QuantitySelectorCart quantity={quan} setQuantity={setQuan} min={1}/>
                    <button type="button" className="hover:text-red-600 p-2" ><DeleteIcon className="text-black"  sx={{fontSize: 40}}/></button>
                </div>
                    
                
            </div>
        </div>
    );
}