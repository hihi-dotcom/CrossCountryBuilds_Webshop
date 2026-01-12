class DateTimeService{
    async gettingFreeDates(){
        const resp = await fetch("http://localhost:3000/appointments");

        const respData = await resp.json();
    }

    async ArrangeDateTime(datearrangement: {date:string, description: string}){
        const response = await fetch("http://localhost:3000/appointment", {
            method: "PATCH",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(datearrangement)
        })
    }
}

export default new DateTimeService();