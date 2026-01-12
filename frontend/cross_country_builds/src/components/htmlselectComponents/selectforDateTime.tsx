import type SelectDateTimeProps from "../../models/prop_models/selectforDatetimeProps";

export default function SelectforDatetime({datetimes}:SelectDateTimeProps){
    return(
        <select name="appointmentDate" id="free-service-times" className="rounded-lg text-black bg-white h-8 text-lg border-2 border-black">
            {datetimes.map((datetime) => <option value={datetime.time} className="text-black font-semibold ">{datetime.time}</option>)}
        </select> 
    );
}