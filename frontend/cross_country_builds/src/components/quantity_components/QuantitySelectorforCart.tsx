import type QuantityProps from "../../models/prop_models/quantityForProductProps";



export default function QuantitySelector({quantity, setQuantity, min = 1}: QuantityProps){
    const increment1 = () => setQuantity((prev: number) => prev + 1);
    const decrement1 = () => setQuantity((prev:number) => (prev > min ? prev - 1 : min));

    return(
        <div className="flex flex-row items-center mx-auto text-4xl w-fit  ">
            <button type="button" onClick={decrement1} disabled={quantity <= min} className="p-2 h-fit text-white bg-[#08415c] rounded-l-lg border-2 border-transparent hover:border-white">-</button>
            <p className="text-white bg-[#08415c] p-2 h-15 ">{quantity}</p>
            <button type="button" onClick={increment1} className="p-2 text-white bg-[#08415c] rounded-r-lg border-2 border-transparent hover:border-white">+</button>
        </div>
    );
}