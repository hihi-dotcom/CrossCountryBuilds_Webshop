class DateTimeService{
    async gettingFreeDates(){
        const resp = await fetch("http://localhost:3000/appointments");

        const respData = await resp.json();
    }

    async ArrangeDateTime(datearrangement: {appointmentDate:string, description: string}){
        const response = await fetch("http://localhost:3000/appointment", {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(datearrangement)
        });
        return await response.json();
    }
}

export default new DateTimeService();