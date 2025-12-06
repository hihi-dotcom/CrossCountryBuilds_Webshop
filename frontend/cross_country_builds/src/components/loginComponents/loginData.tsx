import { FormField } from "../formFieldComponents/textField";

export default function LoginModule(){
    return(
        <form id="loginsection">
            <FormField
                input_name="felhasznalonev"
                input_id="felhasznalonev"
                input_placeholder="felhasználónév"
            />

            <FormField
                input_name="jelszo"
                input_id="jelszo"
                input_placeholder="jelszó"
            />
        </form>
    );
}