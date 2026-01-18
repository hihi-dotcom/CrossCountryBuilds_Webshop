import { data, redirect } from "react-router-dom";
import loginSchema from "../components/validationSchemes/loginScheme";
import { z } from "zod";

import registScheme from "../components/validationSchemes/registrScheme";
import AuthService from "../services/AuthService";

export async function loginAction({request}: {request: Request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData)

    const result = loginSchema.safeParse(data);
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    const response = await AuthService.login(result.data);
    if(!response.ok){
        return {serverError: "Hibás felhasználónév vagy jelszó!"};
    }

    const userData = await response.json();

    if(userData.role === 'admin'){
        return redirect("/admin");
    }
    return redirect("/");

}

export async function registerAction({ request }: {request: Request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = registScheme.safeParse(data);
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    };

    const response = await AuthService.registration(result.data);
    if(!response.ok){
        return {
            serverError: "A regisztráció sajnos nem sikerült. Próbálkozz más adatokkal!"
        }
    }

    return redirect("/login");
};

export async function logoutAction(){
    await AuthService.logout();
    localStorage.removeItem('bike-cart');
    return redirect("/login");
}