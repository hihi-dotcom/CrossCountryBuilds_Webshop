import type { RegistrationCreds, LoginCreds } from "../models/models_for_services/auth_models";

const API_url: string = `http://localhost:3000/auth/`;

class AuthService {
    async _request(endpoint: string, options = {}){
        const url =`${API_url}${endpoint}`;

        const defaultOptions = {
            credentials: 'include',
            headers: {
                'Content-Type':'application/json'
            }
        }
    }

    async registration({name, email, password}:RegistrationCreds){
        return this._request('registration', {
            method: "POST",
            body: JSON.stringify({name, email, password}),
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
            return await this._request('user', {
                method: "GET"
            })
        }
        catch(err){
            return null;
        }
    }
}