import { useRef } from "react";
import { TextInput } from "../formFieldComponents/inputwithPlaceholder";
import { FormField } from "../formFieldComponents/textField";

import KategoriakSelect from "../htmlselectComponents/selectinszurok";


export function Szurok() {

    const termekKategoriak = [
    {
        value: "kerekparok",
        name: "kerékpárok"
    },
    {
        value: "kiegeszitok",
        name: "kiegészítők"
    },
    {
        value: "eszkozok",
        name: "Eszközök"
    },
    {
        value: "ruhazat",
        name: "ruházat"
    }
    ];

    const termekNeveRef = useRef("");
    const termekGyartojaRef = useRef("");
    const kategoriakRef = useRef("");

    return (
        <div className="szurok bg-transparent p-8 sm:bg-[#6b818c] rounded-2xl max-w-md mx-auto mt-5">

            <h1 className="text-center text-8xl sm:text-9xl font-semibold text-slate-100 mb-8">
                Keresés
            </h1>

            
            <div className="space-y-6 w-full">

                <FormField
                    input_name="termek_neve"
                    input_id="termek_neve"
                    input_placeholder="termék neve"
                    ref={termekNeveRef}
                />

                <FormField
                    input_name="termek_gyartoja"
                    input_id="termek_gyartoja"
                    input_placeholder="termék gyártója"
                    ref={termekGyartojaRef}
                />

                <KategoriakSelect options={termekKategoriak} ref={kategoriakRef}/>
            </div>

           
            <div className="mt-8 w-full">
                <label className="block text-slate-100 mb-2">Termék ára:</label>

                <div className="flex gap-4">
                    <TextInput
                        inp_type="number"
                        inp_name="artol"
                        inp_id="artol"
                        inp_placeholder="-tól"
                        inp_className="text-black bg-amber-50 w-full rounded-lg h-10 px-3 placeholder-black"
                    />

                    <TextInput
                        inp_type="number"
                        inp_name="arig"
                        inp_id="arig"
                        inp_placeholder="-ig"
                        inp_className="text-black bg-amber-50 w-full rounded-lg h-10 px-3 placeholder-black"
                    />
                </div>
            </div>

        
            <button
                type="button"
                className="mt-10 block mx-auto bg-[#cc2936] text-amber-50 py-3 px-8 
                           rounded-xl text-lg font-semibold
                           hover:bg-[#b0202c] active:bg-[#8e1a23] transition"
            >
                Keresés
            </button>
        </div>


    );


}