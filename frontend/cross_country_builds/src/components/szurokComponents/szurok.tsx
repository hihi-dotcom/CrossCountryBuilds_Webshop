import { useRef } from "react";
import { TextInput } from "../formFieldComponents/inputwithPlaceholder";
import { Form, useSearchParams } from "react-router-dom";
import KategoriakSelect from "../htmlselectComponents/selectinszurok";
import { useState } from "react";
import searchScheme from "../validationSchemes/searchScheme";


export function Szurok({ onSearch }: { onSearch: (filters: any) => void }) {
    const [searchParams] = useSearchParams();
    const [errors, setErrors] = useState<Record<string, string>>({});
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
    /*
    const handleSearching = () => {
            const searchData = {
                name: termekNeveRef.current?.value || "",
                maker: termekGyartojaRef.current?.value || "",
                category: kategoriakRef.current?.value || "",
                priceFrom: Number(priceFrom.current?.value) || 0,
                priceTo: Number(priceTo.current?.value) || 4000000
            };

            const result = searchScheme.safeParse(searchData);

            if(!result.success){
                const fieldErrors: Record<string, string> = {};
                result.error.issues.forEach((issue) => {
                    const key = String(issue.path[0])
                    fieldErrors[key] = issue.message;
                });
                setErrors(fieldErrors);
                return;
            }
            onSearch(searchData);
    };
    */
    return(
        <Form method="get" key={searchParams.toString()} className="border-t-2 border-white border-b-2 md:border-transparent ">
            <div className="szurok bg-transparent p-6 md:bg-[#3f484c] rounded-2xl w-full mx-auto">

                <h1 className="text-center text-5xl sm:text-7xl font-semibold text-slate-100 mb-8">
                    Keresés
                </h1>

                
                <div className="space-y-6 w-full">
                    <div>

                        <input type="text" name="name" id="termek_neve" placeholder="termék neve"  className="bg-transparent text-xl text-white  border-amber-50 border-2 sm:bg-amber-50 sm:text-black rounded-xl h-9 w-full placeholder-white sm:placeholder-black sm:rounded-lg px-4 py-5 focus:outline-none"/>
                        <p className="text-rose-400 md:text-orange-300 text-sm pt-1 font-semibold">
                            {errors.productName}
                        </p>
                    </div>
                       
                    <div>
                        <input type="text" name="maker" id="termek_gyartoja" placeholder="termék gyártója"    className="bg-transparent text-xl text-white  border-amber-50 border-2 rounded-xl sm:bg-amber-50 sm:text-black h-9 w-full placeholder-white sm:placeholder-black sm:rounded-lg px-4 py-5 focus:outline-none" />
                        <p className="text-rose-400 md:text-orange-300 text-sm pt-1 font-semibold">
                            {errors.maker}
                        </p>
                    </div>
                    <div>
                        <KategoriakSelect options={termekKategoriak} />
                        <p className="text-rose-400 md:text-orange-300 text-sm pt-1 font-semibold">
                            {errors.category}
                        </p>
                    </div>
                    
                </div>

            
                <div className="mt-8 w-full">
                    <label className="block text-3xl text-slate-100 mb-2">Termék ára:</label>

                    <div className="flex gap-4 max-w-full">
                        <div className="flex-1">
                            <TextInput
                                inp_type="number"
                                inp_name="priceFrom"
                                inp_id="artol"
                                inp_placeholder="-tól"
                                inp_className="text-white md:text-black placeholder-white  bg-amber-50 w-full rounded-lg h-10 px-3 bg-transparent text-white border-2 border-white md:bg-white md:placeholder-black "
                                
                               
                            />
                            <p className="text-rose-400 md:text-orange-300 text-sm pt-1 font-semibold">
                            {errors.priceFrom}
                            </p>
                        </div>
                        <div className="flex-1">
                            <TextInput
                                inp_type="number"
                                inp_name="priceTo"
                                inp_id="arig"
                                inp_placeholder="-ig"
                                inp_className="text-white md:text-black placeholder-white  bg-amber-50 w-full rounded-lg h-10 px-3 bg-transparent text-white border-2 border-white md:bg-white md:placeholder-black"
                                
                                
                            />
                             <p className="text-rose-400 md:text-orange-300 text-sm pt-1 font-semibold">
                                {errors.priceTo}
                            </p>
                        </div>   

                    </div>
                </div>

            
                <button
                    type="submit"
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