import { TextInput } from "../formFieldComponents/inputwithPlaceholder";
import { FormField } from "../formFieldComponents/textField";

export function Szurok(){
    return(
        <div className="szurok p-6 bg-[#6b818c]">
            <h1 className="text-center">Keresés</h1>
            <div className="formfields block mx-auto">
                <p className="py-6"><FormField input_name="termek_neve" input_id="termek_neve" input_placeholder="termék neve"/></p>
                <p className="py-6"><FormField input_name="termek_gyartoja" input_id="termek_gyartoja" input_placeholder="termék gyártója"/></p>
                <p><label htmlFor="ar">Termék ára: </label></p>
                <p><TextInput inp_type="number" inp_name="artol" inp_id="artol" inp_placeholder="-tól" inp_className="text-black bg-amber-50 w-20 mr-4 rounded-lg h-9"/><TextInput inp_type="number" inp_name="arig" inp_id="arig" inp_placeholder="-ig" inp_className="text-black bg-amber-50 w-20 rounded-lg h-9"/></p>
            </div>
            <button type="button" className=" block mx-auto bg-[#cc2936] text-amber-50  my-6 p-4 rounded-xl">Keresés</button>
        </div>
    );
}