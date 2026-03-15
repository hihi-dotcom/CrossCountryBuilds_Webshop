import { redirect } from "react-router-dom";
import type { RegistrationDTO, LoginDTO } from "../dtos/models_for_services/auth_models";
import { LogInRespDTO } from "../dtos/LoginRespDTO";
import { RegistrationRespDTO } from "../dtos/RegistrationRespDTO";
import {requestHandler, setToken, getToken, removeToken} from "./utils/auth";

const API_url: string = `http://localhost:3000/api/`;

class AuthService {

  

    async registration({username, email, password, confirmPassword}:RegistrationDTO):Promise<RegistrationRespDTO>{
        const response = await requestHandler('signup', {
            method: "POST",
            body: JSON.stringify({username, email, password, confirmPassword}),
        });
            const data = await response.json();
        if(response.ok){
            return {
                ok: true, 
               message: data.message,
               redirect: data.redirect
            };
        }
        
        return {
            ok: false,
            message: data.message || "Hiba történt a regisztráció során!"
        };
    }

    async login({username, password}:LoginDTO):Promise<LogInRespDTO>{
        const response = await requestHandler('login', {
            method: "POST",
            body: JSON.stringify({username, password})
        });
        const data = await response.json();
        if(response.ok){
            
            if(data.token){
                setToken(data.token);
                return {
                    ok: true, 
                    data,
                    username: data.name,
                    message: data.message,
                    
                };
            };
        }
        return {
            ok: false,
            message: data.message
        };
    }

    async logout(){
        try{        
            await requestHandler('logout', {
                method: "POST"
            })
        }
        finally{
            removeToken();
            localStorage.removeItem('bike-cart');
        }

    }

    async gettingCurrentUser(){

        if(!getToken()){
            return null;
        }

        try{
            const response =  await requestHandler('user', {
                method: "GET"
            })

            if(!response.ok){
                return null;
            }

            return await response.json();
        }
        catch(err){
            console.error("Hiba a user lekérésekor:", err)
            return null;
        }
    }
        
};


export default new AuthService();