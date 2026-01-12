import SelectforDatetime from "../htmlselectComponents/selectforDateTime";
import { Form } from "react-router-dom";

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
            <h3 className="text-3xl text-center sm:text-start sm:text-4xl my-5 sm:ml-6 sm:my-10 ">Foglalj időpontot hozzánk!</h3>
            <Form method="POST">
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 w-full mx-auto">
                    <div id="free-datetimes" className="flex flex-col  m-5 h-fit  bg-[#f1bf98] rounded-2xl py-4 px-4 md:py-5 md:px-4 xl:py-6 xl:px-5 shadow-2xl">
                        <h2 className="text-2xl text-black ">Válassz szabad időpontjaink közül!</h2>
                        <SelectforDatetime datetimes={test_free_datetimes}/>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>
                    <div className="max-w-lg text-lg bg-[#cc2936] shadow-2xl h-fit p-5 rounded-2xl m-5">
                        <h2 className="text-4xl">Fontos!</h2>
                        <p>Arról, hogy mikor jöhetsz a kerékpárodért e-mailben értesítünk!</p>
                        <p className="text-end">Köszönettel:<br/> A csapat</p>
                    </div>

                    <div className="max-w-lg text-lg  shadow-2xl h-fit p-5 rounded-2xl m-5 bg-[#4b5a62]">
                        
                        <textarea id="message" name="message" rows={4} className="bg-white border border-black text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body placeholder:text-black placeholder:text-lg" placeholder="Mesélj a problémáról...."></textarea>
                        <p className="text-red-600 text-2xl pt-3 font-semibold"></p>
                    </div>

                    <div className="flex w-fit mx-auto mt-10">
                        <button type="submit" className="py-5 px-4  bg-[#116992] h-fit text-xl rounded-lg hover:border-2 hover:border-white hover:font-bold">Beküldés!</button>
                    </div>
                </div>
            </Form>
        </>
    );
}