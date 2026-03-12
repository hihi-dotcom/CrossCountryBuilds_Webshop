import { redirect } from "react-router-dom";
import AuthService from "../../services/AuthService";

export async function adminLoader(){
    const user = await AuthService.gettingCurrentUser();

    if(!user || user.role !== "admin"){
        return redirect("/login");
    }

    return user;
}