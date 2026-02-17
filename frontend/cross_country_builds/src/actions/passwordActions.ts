import createNewPassScheme from "../components/validationSchemes/createNewPassScheme";

import getPassEmailScheme from "../components/validationSchemes/getPasswordEmailScheme";

import PasswordService from "../services/PasswordService";
import { redirect } from "react-router-dom";

export async function getPassEmailAction({request}: {request: Request}) {
    const fData = await request.formData();
    const data = Object.fromEntries(fData);
    const result = getPassEmailScheme.safeParse(data);
    if(!result.success){
        return{
            errors: result.error.flatten().fieldErrors
        }
    };

    const sendEmailResult = await PasswordService.forgotPass(result.data);

    if(!sendEmailResult.ok){
        return {serverError: sendEmailResult.message}
    }
    else{
        return sendEmailResult.message;
    }
};

export async function createPassAction({request}: {request: Request}){
    const fData = await request.formData();
    const data = Object.fromEntries(fData);

    const url = new URL(request.url);
    const token = url.searchParams.get("token"); 
    if(!token){
        return {serverError: "Hiányzó vagy érvénytelen  jelszó visszaállító token!"};
    }

    const result = createNewPassScheme.safeParse(data);
    if(!result.success){
        return{
            errors: result.error.flatten().fieldErrors
        }
    }

    const createPassResult = await PasswordService.createNewPass(token,{
        newjelszo: result.data.newjelszo, 
        newjelszo2: result.data.newjelszo2
    })
    if(!createPassResult.ok){
        return {serverError: createPassResult.message}
    }
    else{
        return redirect("/login?success=true");
    }
}