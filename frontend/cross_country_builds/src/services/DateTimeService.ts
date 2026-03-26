import { DateTimeBookRespDTO } from "../dtos/DateTimeBookRespDTO";
import { DateTimeFinalizeRespDTO } from "../dtos/DateTimeFinalizeRespDTO";
import { DateTimeFreeServiceRespDTO } from "../dtos/DateTimeFreeServiceRespDTO";
import { DateTimeDeleteServiceRespDTO } from "../dtos/DateTimeDeleteServiceRespDTO";
import {requestHandler} from "./utils/auth";
import DateTime from "../models/datetime";
class DateTimeService{
    async gettingFreeDates():Promise<DateTime[]>{
        const resp = await requestHandler("freeappointments");

        const respData = await resp.json();

        return respData;
    };

    async bookAServiceDate(id: number, data:{appointmentDate:string, problem_description:string}):Promise<DateTimeBookRespDTO>{
   
        const response = await requestHandler(`appointment?id=${id}`,{
            method: "PATCH",

            body: JSON.stringify(data)
        });

        const resp = await response.json();

        return {
            ok: response.ok,
            message: resp.message
        };
    };

    async finalizeService(id:number, data:{service_id:string, service_price:number, bringback_date: string}):Promise<DateTimeFinalizeRespDTO>{
        const response = await requestHandler(`admin/finalize?id=${id}`, {
            method: "PATCH",
            body: JSON.stringify({
                service_id: data.service_id,
                service_price: data.service_price,
                bringback_date: data.bringback_date
            }),
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message
        }
    };

    async createFreeService(data:{appointmentDate:string}):Promise<DateTimeFreeServiceRespDTO>{
        const response = await requestHandler(`newappointment`, {
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
        const response = await requestHandler(`appointment?id=${id}`, {
            method: "DELETE"
        });

        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async getAppointmentsforAdmin():Promise<DateTime[] | []>{
        const response = await requestHandler(`admin/appointments`, {
            method: "GET"
        });
        const respD = await response.json();
        if(!response.ok){
            throw new Error(respD.message || "Hiba a szervizidőpontok lekérésekor! ");
        }
        return await respD;
    }

    
    async getAppointmentById(id: number):Promise<DateTime | null>{
        const response = await requestHandler(`admin/appointment?id=${id}`);
        const data = await response.json();
        
        
        return data.length > 0 ? data[0] : null;
    }

    
}

export default new DateTimeService();