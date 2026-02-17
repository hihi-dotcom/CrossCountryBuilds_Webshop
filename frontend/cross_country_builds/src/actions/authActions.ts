import { redirect } from "react-router-dom";
import loginSchema from "../components/validationSchemes/loginScheme";


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

    const loginResult = await AuthService.login(result.data);
    if(!loginResult.ok){
        return {serverError: loginResult.message || "Hibás felhasználónév vagy jelszó!"};
    }

    const userData = loginResult.data;

    if(userData && userData.role === 'admin'){
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

    const regResult = await AuthService.registration(result.data);
    if(!regResult.ok){
        return {
            serverError: regResult.message || "A regisztráció sajnos nem sikerült. Próbálkozz más adatokkal!"
        }
    }

    return redirect(regResult.redirect);
};

export async function logoutAction(){
    await AuthService.logout();
    return redirect("/login");
}