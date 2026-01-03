import KosarbaButton from "../buttonComponents/kosarbaonProductPage";
import QuantitySelector from "../quantity_components/Quantity_Selector";
import { useState } from "react";

export default function ProductModule(){

    const [menny, setMenny] = useState(1);
    return(
        <main>
            <section>
                
            </section>
            <section>
                <div className="flex flex-row">
                    <QuantitySelector quantity={menny} setQuantity={setMenny} min={0}/>
                    <KosarbaButton/>
                </div>
            </section>
        </main>
    );
}