import type FreeDate from "../models/models_for_services/datetime_models";

class DateTimeService{
    async gettingFreeDates(){
        const resp = await fetch("http://localhost:3000/appointments");

        const respData = await resp.json();

        return respData;
    };

    async ArrangeDateTime(datearrangement: {appointmentDate:string, description: string}){
        const response = await fetch("http://localhost:3000/appointment", {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(datearrangement)
        });
        return await response.json();
    };

    async DeleteDateTime(id: number){
        const response = await fetch(`http://localhost:3000/appointment/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type':'application/json'
            }
        });

        return await response.json();
    };


    async addNewDateTime(free: FreeDate){
        const response = await fetch('http://localhost:3000/date',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(free)
        });

        const respData = await response.json();

        return respData;
    }
}

export default new DateTimeService();