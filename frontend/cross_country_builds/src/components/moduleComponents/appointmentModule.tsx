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
            <h3 className="text-4xl">Foglalj időpontot hozzánk!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div id="free-datetimes max-w-lg w-full">
                    <ul className="">
                        {test_free_datetimes.map((appointment:{time: string}) => <li className="py-3">{appointment.time}<ChooseButton/></li>)}
                    </ul>
                </div>
                <div className="max-w-lg text-lg bg-[#cc2936] shadow-2xl h-fit p-5 rounded-2xl m-5">
                    <h2 className="text-4xl">Fontos!</h2>
                    <p>Arról, hogy mikor jöhetsz a kerékpárodért e-mailben értesítünk!</p>
                    <p className="text-end">Köszönettel:<br/> A csapat</p>
                </div>

                <div className="max-w-lg text-lg  shadow-2xl h-fit p-5 rounded-2xl m-5">
                    <p>Mesélj a problémádról!</p>
                    <textarea id="message" rows={4} className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body" placeholder="Minnél bővebben...."></textarea>
                    <button type="submit">Beküldés</button>
                </div>
            </div>

        </>
    );
}