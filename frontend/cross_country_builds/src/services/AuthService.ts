import type { RegistrationCreds, LoginCreds } from "../models/models_for_services/auth_models";

const API_url: string = `http://localhost:3000/`;

class AuthService {
    async _request(endpoint: string, options : RequestInit = {}){
        const url =`${API_url}${endpoint}`;

        const defaultOptions : RequestInit = {
            credentials: 'include',
            headers: {
                'Content-Type':'application/json'
            }
        };

        return await fetch(url, {...defaultOptions, ...options})
    }

    async registration({username, email, password, confirmPassword}:RegistrationCreds){
        return this._request('signup', {
            method: "POST",
            body: JSON.stringify({username, email, password, confirmPassword}),
        })
    }

    async login({username, password}:LoginCreds){
        return this._request('login', {
            method: "POST",
            body: JSON.stringify({username, password})
        })
    }

    async logout(){
        return this._request('logout', {
            method: "POST"
        })
    }

    async gettingCurrentUser(){
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