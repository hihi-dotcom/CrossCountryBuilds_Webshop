import dateSchema, { AppointmentSchema } from "../components/validationSchemes/dateScheme";
import DateTimeService from "../services/DateTimeService";
import { redirect } from "react-router-dom";

export async function serviceDateTimeAction({request}: {request:Request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const appointmentId = Number(data.appointmentDate);
    const result = dateSchema(data.appointmentDate).safeParse(data);
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    }
    try{
        const response = await DateTimeService.bookAServiceDate(appointmentId,{
            appointmentDate: result.data.appointmentDate,
            description: result.data.message
        });

        if(!response.ok){
            return{
                serverError: response.message || "Nem sikerült az időpontfoglalás a szervizünkbe!"
            }
        }

        return redirect("/");
    }
    catch(error:any){
        return{
            serverError: "Hiba történt az időpont mentése során! "
        };
    }
   

}


export async function createEmptyAppointmentAction({request}: {request: Request}){
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = AppointmentSchema.safeParse(data);
    if(!result.success){
        return { errors: result.error.flatten().fieldErrors };
    }
    
    try {
        await DateTimeService.createFreeService(result.data);
        return { success: true }; 
    } catch(error: any) {
        
        return {
            serverError: error.message || "Az időpont létrehozása sikertelen volt!"
        };
    }
}


export async function appointmentLoader(){
    try{
        const dates = await DateTimeService.gettingFreeDates();

        if (dates && !Array.isArray(dates)) {
            return []; 
        }
        
        return dates || [];
    }
    catch(error){
        console.log("Hiba a szabad szervizidőpontok betöltésekor:", error);
        return [];
    }
}

export async function appointmentLoaderById({params}:any){
    const id = params.id;

    const response = await DateTimeService.getAppointmentById(parseInt(id));
    if(!response){
        throw new Response("A termék nem található", {status: 404});
    };

    return response;
};

export async function UpdateAppointment({request, params}:any){
    const data = await request.formData();
    const AppointmentId = params.id
    const DatetimeData = {
        service_id: data.get("service_id") || AppointmentId,
        price: data.get("service_price"),
        bringBackDate: data.get("bringback_date"),
    };
    
    const productId = params.id;
    try{
        const response = await DateTimeService.finalizeService(Number(productId),DatetimeData);
        
        if(!response.ok){
           return {message: response.message || "A szerviz lezárása közben szerverhiba történt."};
        }
         return redirect("/admin/dates");
    }
    catch(err:any){
        console.log(`Hiba történt a véglegesítéskor: ${err}`);

        return{
            message: err.message || "Váratlan szerverhiba!"
        }
    }
   
}
