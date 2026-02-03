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
        return{
            errors: result.error.flatten().fieldErrors
        }
    }
    try{
        await DateTimeService.createFreeService(result.data);
    }
    catch(error:any){
        return{
            serverError: error.message || "Az időpont létrehozása sikertelen volt!"
        }
    }
}
