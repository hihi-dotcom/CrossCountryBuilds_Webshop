import { useRef } from "react";
import { TextInput } from "../formFieldComponents/inputwithPlaceholder";
import { FormField } from "../formFieldComponents/textField";
import { Form } from "react-router-dom";
import KategoriakSelect from "../htmlselectComponents/selectinszurok";


export function Szurok({ onSearch }: { onSearch: (filters: any) => void }) {

    const termekKategoriak = [
    {
        value: "kerékpárok",
        name: "kerékpárok"
    },
    {
        value: "kiegészítők",
        name: "kiegészítők"
    },
    {
        value: "Eszközök",
        name: "Eszközök"
    },
    {
        value: "ruházat",
        name: "ruházat"
    }
    ];

    const termekNeveRef = useRef<HTMLInputElement>(null);
    const termekGyartojaRef = useRef<HTMLInputElement>(null);
    const kategoriakRef = useRef<HTMLSelectElement>(null);
    const priceFrom = useRef<HTMLInputElement>(null);
    const priceTo = useRef<HTMLInputElement>(null);

    const handleSearching = () => {
            const searchData = {
                name: termekNeveRef.current?.value || "",
                maker: termekGyartojaRef.current?.value || "",
                category: kategoriakRef.current?.value || "",
                priceFrom: Number(priceFrom.current?.value) || 0,
                priceTo: Number(priceTo.current?.value) || 4000000
            };
            onSearch(searchData);
    };

    return(
        <Form method="post">
            <div className="szurok bg-transparent p-6 sm:bg-[#6b818c] rounded-2xl w-full mx-auto">

                <h1 className="text-center text-5xl sm:text-7xl font-semibold text-slate-100 mb-8">
                    Keresés
                </h1>

                
                <div className="space-y-6 w-full">
                    <div>
                         <FormField
                            input_name="productName"
                            input_id="termek_neve"
                            input_placeholder="termék neve"
                            type="text"
                            ref={termekNeveRef}
                            onChange={handleSearching}
                        />
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                       
                    <div>
                        <FormField
                            input_name="maker"
                            input_id="termek_gyartoja"
                            input_placeholder="termék gyártója"
                            type="text"
                            ref={termekGyartojaRef}
                            onChange={handleSearching}
                        />
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    <div>
                        <KategoriakSelect options={termekKategoriak} ref={kategoriakRef} OnChange={handleSearching}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    
                </div>

            
                <div className="mt-8 w-full">
                    <label className="block text-3xl text-slate-100 mb-2">Termék ára:</label>

                    <div className="flex gap-4">
                        <div>
                            <TextInput
                                inp_type="number"
                                inp_name="priceFrom"
                                inp_id="artol"
                                inp_placeholder="-tól"
                                inp_className="text-black bg-amber-50 w-full rounded-lg h-10 px-3 placeholder-black"
                                ref={priceFrom}
                                OnChange={handleSearching}
                            />
                            <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                        </div>
                        <div>
                            <TextInput
                                inp_type="number"
                                inp_name="priceTo"
                                inp_id="arig"
                                inp_placeholder="-ig"
                                inp_className="text-black bg-amber-50 w-full rounded-lg h-10 px-3 placeholder-black"
                                ref={priceTo}
                                OnChange={handleSearching}
                            />
                            <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                        </div>   

                    </div>
                </div>

            
                <button
                    type="button"
                    onClick={handleSearching}
                    className="mt-10 block mx-auto bg-[#cc2936] text-amber-50 py-3 px-8 
                            rounded-xl text-lg font-semibold
                            hover:bg-[#b0202c] active:bg-[#8e1a23] border-transparent border-2 hover:border-white hover:font-bold  transition"
                >
                    Keresés
                </button>
                 <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
            </div>
        </Form>



    );


}