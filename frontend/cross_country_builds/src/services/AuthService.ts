import { redirect } from "react-router-dom";
import type { RegistrationDTO, LoginDTO } from "../dtos/models_for_services/auth_models";
import { LogInRespDTO } from "../dtos/LoginRespDTO";
import { RegistrationRespDTO } from "../dtos/RegistrationRespDTO";

const API_url: string = `http://localhost:3000/api/`;

class AuthService {

    private getToken(): string | null {
        return localStorage.getItem("token");
    };

    private removeToken(){
        localStorage.removeItem("token");
    };
    private setToken(token:string): void{
        localStorage.setItem("token", token);
    }
    async _request(endpoint: string, options : RequestInit = {}){
        const url =`${API_url}${endpoint}`;
        const token = this.getToken();

        const headers: Record<string, string> = { ...options.headers as Record<string, string> };

        if(!(options.body instanceof FormData)){
            headers['Content-Type'] = 'application/json';
        }

        if(token){
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if(response.status === 401){
            this.removeToken();
            if(!window.location.pathname.includes('/login')){
                window.location.href = '/login?expired=true'
            }
        };

        return response;

        
    }

    async registration({username, email, password, confirmPassword}:RegistrationDTO):Promise<RegistrationRespDTO>{
        const response = await this._request('signup', {
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
        const response = await this._request('login', {
            method: "POST",
            body: JSON.stringify({username, password})
        });
        const data = await response.json();
        if(response.ok){
            
            if(data.token){
                this.setToken(data.token);
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
            await this._request('logout', {
                method: "POST"
            })
        }
        finally{
            this.removeToken();
            localStorage.removeItem('bike-cart');
        }

    }

    async gettingCurrentUser(){

        if(!this.getToken()){
            return null;
        }

        try{
            const response =  await this._request('user', {
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