import { useLoaderData } from "react-router-dom";
import { EditAppointmentForm } from "../../components/adminComponents/admin_appointmentEditForm";

export function EditAppointmentPage(){
    const data = useLoaderData();
    console.log(data);
    return(
        <>
            <EditAppointmentForm appointment={data}/>
        </>
    );
}