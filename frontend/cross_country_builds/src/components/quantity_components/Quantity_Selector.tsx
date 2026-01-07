import type QuantityProps from "../../models/prop_models/quantityForProductProps";



export default function QuantitySelector({quantity, setQuantity, min = 1}: QuantityProps){
    const increment = () => setQuantity((prev: number) => prev + 1);
    const decrement = () => setQuantity((prev:number) => (prev > min ? prev - 1 : min));

    return(
        <div className="flex flex-row items-center mx-auto text-4xl w-full ">
            <button type="button" onClick={decrement} disabled={quantity <= min} className="p-2 h-fit text-black bg-[#eee5e9] rounded-l-lg border-2 border-transparent hover:border-black">-</button>
            <p className="text-black bg-[#eee5e9] p-2 h-15 ">{quantity}</p>
            <button type="button" onClick={increment} className="p-2 text-black bg-[#eee5e9] rounded-r-lg border-2 border-transparent hover:border-black">+</button>
        </div>
    );
}