import ChooseButton from "../buttonComponents/chooseButtontoTime";

export default function AppointmentModule(){

    const test_free_datetimes = [
        {
            time: "2025. 12. 24. 14:00"
        },
        {
            time: "2025. 12. 10. 10:00"
        },
        {
            time: "2025. 12. 08. 09:00"
        },
        {
            time: "2025. 11. 24. 08:00"
        },
        {
            time: "2025. 12. 04. 15:00"
        },
        {
            time: "2026. 01. 24. 17:30"
        },
    ];
    return(
        <>
            <div id="free-datetimes" className="flex justify-start">
                <ul className=" max-w-xl">
                    {test_free_datetimes.map((appointment:{time: string}) => <li>{appointment.time}<ChooseButton/></li>)}
                </ul>
            </div>
        </>
    );
}