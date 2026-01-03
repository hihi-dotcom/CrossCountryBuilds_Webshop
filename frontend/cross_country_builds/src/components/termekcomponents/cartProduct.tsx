import DeleteIcon from "@mui/icons-material/Delete"

import type CartProductProps from "../../models/prop_models/cartProductProps";
export default function CartProduct({termek_name, termek_pic,termek_price}: CartProductProps){


    return(
        <div className="sm:w-full w-fit px-2 mb-10 sm:px-0">
            <div className="flex max-w-3xl  sm:inline-flex h-fit py-4 px-2  w-full sm:w-fit  justify-center items-center gap-6 sm:gap-12 bg-[#f1bf98] rounded-xl mx-auto  sm:my-3 sm:ml-24">
                <img src={termek_pic} alt="termék képe" className="rounded-full shrink-0 w-20 h-auto object-cover"/>
                <h2 className="text-2xl text-black">{termek_name}</h2>
                <h2 className="text-2xl text-black">{termek_price} Ft</h2>
                <button type="button" ><DeleteIcon className="text-black"  sx={{fontSize: 40}}/></button>
            </div>
        </div>

    );
}