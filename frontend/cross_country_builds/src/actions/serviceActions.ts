import dateSchema from "../components/validationSchemes/dateScheme";
import DateTimeService from "../services/DateTimeService";
import type { DateTimeBookRespDTO } from "../dtos/DateTimeBookRespDTO";
import { redirect } from "react-router-dom";

export async function serviceDateTimeAction({request}: {request:Request}) {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const result = dateSchema(data.appointmentDate).safeParse(data);
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    }

    const response:DateTimeBookRespDTO = await DateTimeService.ArrangeDateTime({
        appointmentDate: result.data.appointmentDate,
        description: result.data.message
    });

    if(response.state !== "ok"){
        return{
            serverError: "Nem sikerült az időpontfoglalás a szervizünkbe!"
        }
    }

    return redirect("/");

}