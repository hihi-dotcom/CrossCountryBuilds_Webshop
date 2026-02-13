import type SelectDateTimeProps from "../../models/prop_models/selectforDatetimeProps";

export default function SelectforDatetime({datetimes}:SelectDateTimeProps){
    return(
        <select name="appointmentDate" id="free-service-times" className="rounded-lg text-black bg-white h-8 text-lg border-2 border-black">
            {datetimes.map((datetime) => <option  key={datetime.id} value={datetime.id} className="text-black font-semibold ">{new Date(datetime.service_date).toLocaleString('hu-HU', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}</option>)}
        </select> 
    );
}