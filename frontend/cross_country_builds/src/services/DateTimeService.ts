import AuthService from "./AuthService";
import type BookCreds from "../models/models_for_services/datetime_models";
import type FinalizeCreds from "../models/models_for_services/datetime_models";
import type FreeDate from "../models/models_for_services/datetime_models";

class DateTimeService{
    async gettingFreeDates(){
        const resp = await AuthService._request("http://localhost:3000/freeappointments");

        const respData = await resp.json();

        return respData;
    };

    async bookAServiceDate(id: number, data:BookCreds){
   
        const response = await AuthService._request(`appointment/${id}`,{
            method: "PATCH",

            body: JSON.stringify(data)
        });

        const resp = await response.json();

        return {
            ok: response.ok,
            message: resp.message
        };
    };

    async finalizeService(id:number, data:FinalizeCreds){
        const response = await AuthService._request(`appointment/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message
        }
    };

    async createFreeService(data:FreeDate){
        const response = await AuthService._request(`newappointment`, {
            method: "POST",
            body: JSON.stringify(data)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message
        }
    };

    async deleteService(id:number){
        const response = await AuthService._request(`appointment/${id}`, {
            method: "DELETE"
        });

        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async getAppointmentsforAdmin(){
        const response = await AuthService._request(`appointments`, {
            method: "GET"
        });

        return await response.json();
    }
    
}

export default new DateTimeService();