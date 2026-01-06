import KosarbaButton from "../buttonComponents/kosarbaonProductPage";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";
import Bigbicikli from "../../assets/letöltés.jpg";
import QuantitySelector from "../quantity_components/Quantity_Selector";
import { useState } from "react";

export default function ProductModule(){

    const [menny, setMenny] = useState(1);
    return(
        <main>
            <section>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 xl:gap-16 items-start mb-10">
                    <div className="w-full">
                        <img src={Bigbicikli} alt="Szép termék kép" className="w-full h-auto rounded-2xl shadow-2xl object-cover aspect-4/3"/>
                    </div>
                   
                    <div className="flex flex-col h-full justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Termék neve</h1>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 text-2xl font-medium opacity-90">
                            <p>Gyártó: KTM</p>
                            <p>Kategória: hegybicikli</p>
                        </div>
                        <div className="text-base leading-relaxed opacity-80 mt-2 space-y-2">
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi tempore sequi perferendis, dicta excepturi illo dignissimos consequatur eveniet voluptate ea asperiores, ipsum eos enim dolorum repellendus molestiae deserunt. Cumque porro corrupti ea excepturi, dolore minima eum ad doloribus, veniam temporibus soluta harum dolor ab eius saepe est nam assumenda officia consectetur veritatis quam incidunt odit possimus adipisci? m.</p>
                        </div>
                        <div className="mt-4 flex flex-col lg:items-end items-center  gap-8 pt-6">
                            <div className="flex flex-col flex-wrap sm:flex-row items-center justify-center gap-8 w-full lg:w-auto">
                                <p className="text-4xl font-bold whitespace-nowrap">1250000 Ft</p>
                                <div className="flex flex-row items-center gap-x-8">
                                    <QuantitySelector quantity={menny} setQuantity={setMenny} min={1}/>
                                    <KosarbaButton/>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div className="flex flex-col sm:flex-row justify-center md:justify-end  items-center gap-4 mt-24">
                    <BackToWebShopButton/>
                </div>
            </section>
        </main>
    );
}