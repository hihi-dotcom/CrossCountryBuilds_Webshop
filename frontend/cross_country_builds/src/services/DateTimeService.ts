import AuthService from "./AuthService";
import type BookCreds from "../models/models_for_services/datetime_models";
import type FinalizeCreds from "../models/models_for_services/datetime_models";
import type FreeDate from "../models/models_for_services/datetime_models";
const API_URL = "http://localhost:3000/api";
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
        const response = await AuthService._request(`finalize?id=${id}`, {
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

    
    async getAppointmentById(id: number) {
        const response = await AuthService._request(`admin/appointment?id=${id}`);
        const data = await response.json();
        
        
        return data.length > 0 ? data[0] : null;
    }

    
}

export default new DateTimeService();