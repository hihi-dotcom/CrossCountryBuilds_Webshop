import AuthService from "./AuthService";
import { DateTimeBookRespDTO } from "../dtos/DateTimeBookRespDTO";
import { DateTimeFinalizeRespDTO } from "../dtos/DateTimeFinalizeRespDTO";
import { DateTimeFreeServiceRespDTO } from "../dtos/DateTimeFreeServiceRespDTO";
import { DateTimeDeleteServiceRespDTO } from "../dtos/DateTimeDeleteServiceRespDTO";
import DateTime from "../models/datetime";
class DateTimeService{
    async gettingFreeDates(){
        const resp = await AuthService._request("freeappointments");

        const respData = await resp.json();

        return respData;
    };

    async bookAServiceDate(id: number, data:{appointmentDate:string, problem_description:string}):Promise<DateTimeBookRespDTO>{
   
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

    async finalizeService(id:number, data:{service_id:string, price:number, bringBackDate: string}):Promise<DateTimeFinalizeRespDTO>{
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

    async createFreeService(data:{appointmentDate:string}):Promise<DateTimeFreeServiceRespDTO>{
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

    async deleteService(id:number):Promise<DateTimeDeleteServiceRespDTO>{
        const response = await AuthService._request(`appointment?id=${id}`, {
            method: "DELETE"
        });

        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async getAppointmentsforAdmin():Promise<DateTime[] | []>{
        const response = await AuthService._request(`admin/appointments`, {
            method: "GET"
        });
        const respD = await response.json();
        if(!response.ok){
            throw new Error(respD.message || "Hiba a szervizidőpontok lekérésekor! ");
        }
        return await respD;
    }

    
    async getAppointmentById(id: number):Promise<DateTime | null>{
        const response = await AuthService._request(`admin/appointment?id=${id}`);
        const data = await response.json();
        
        
        return data.length > 0 ? data[0] : null;
    }

    
}

export default new DateTimeService();