import AuthService from "./AuthService";
import type BookCreds from "../models/models_for_services/datetime_models";
import type FinalizeCreds from "../models/models_for_services/datetime_models";
import type FreeDate from "../models/models_for_services/datetime_models";

class DateTimeService{
    async gettingFreeDates(){
        const resp = await AuthService._request("freeappointments");

        const respData = await resp.json();

        return respData;
    };

    async bookAServiceDate(id: number, data:any){
   
        const response = await AuthService._request(`appointment?id=${id}`,{
            method: "PATCH",

            body: JSON.stringify(data)
        });

        const resp = await response.json();

        return {
            ok: response.ok,
            message: resp.message
        };
    };

    async finalizeService(id:number, data:{service_id:string, price:number, bringBackDate: string}){
        const response = await AuthService._request(`appointment?id=${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message
        }
    };

    async createFreeService(data:{appointmentDate:string}){
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
        const response = await AuthService._request(`appointment?id=${id}`, {
            method: "DELETE"
        });

        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async getAppointmentsforAdmin(){
        const response = await AuthService._request(`admin/appointments`, {
            method: "GET"
        });
        const respD = await response.json();
        if(!response.ok){
            throw new Error(respD.message || "Hiba a szervizidőpontok lekérésekor! ");
        }
        return await respD;
    }
    
}

export default new DateTimeService();