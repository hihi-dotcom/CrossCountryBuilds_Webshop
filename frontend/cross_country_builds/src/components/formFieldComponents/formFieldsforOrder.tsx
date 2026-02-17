import { FormField } from "./textField";
import { useRef } from "react";

export default function AddressFields({ prefix, label }: { prefix: string, label: string }){

    const irszRef = useRef<HTMLInputElement | null>(null);
    const cityRef = useRef<HTMLInputElement | null>(null);
    const streetRef = useRef<HTMLInputElement | null>(null);
    const HouseNumRef = useRef<HTMLInputElement | null>(null);
return(
    <div className=" rounded-2xl md:p-1">
        <h3 className="font-normal text-2xl mb-2 text-white  border-[#106187]/20 pb-2">{label}</h3>
        
        <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-3">
                <div className="w-1/3">
                    <FormField input_id="irsz" input_name={`${prefix}zipCode`} type="number"  input_placeholder="irányítószám" ref={irszRef} />
                </div>
                <div className="w-2/3">
                    <FormField input_id="varos" input_name={`${prefix}cityName`} type="text" input_placeholder="Város" ref={cityRef} />
                </div>
            </div>
            <div className="flex flex-row gap-4">
                <div className="w-2/3">
                    <FormField input_id="utca" input_name={`${prefix}streetName`} type="text" input_placeholder="Utca / köz" ref={streetRef}/>
                </div>
                <div className="w-1/3">
                    <FormField input_id="hazszam" input_name={`${prefix}houseNumber`} type="number" input_placeholder="Házszám" ref={HouseNumRef}/>
                </div>
            </div>
        </div>
    </div>
)
};