import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { Form } from "react-router-dom";
import DateTimeService from "../../services/DateTimeService";


export default function AppointmentDashboard(){

    const [error, setError] = useState("");
    const [services, setServices] = useState([
        {
        id: 1,
        username: "Zsolti a béka",
        service_date: "2024-05-20T10:00",
        problem_description: "Defekt és fékcsere",
        service_price: null,
        bringback_date: ""
        }
    ]);

    async function handleDeleteAppointment(id:number){
        try{
                    const deleteResult = await DateTimeService.deleteService(id);
                    if(deleteResult.ok){
                        //setServices(prev => prev.filter(p => p.id !== id))
                    }
                    else{
        
                    }
        }
        catch(error){
        
        }
    }


    return(
        <>
            <main className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-50">
                <div className="lg:col-span-1">
                    <AdminSidebar 
                        link1_to="/admin/orders"
                        link1_innerText="Megrendelések Dashboard"
                        link2_to="/admin/products"
                        link2_innerText="Termékek Dashboard"
                        link3_to="/admin/users"
                        link3_innerText="Felhasználók Dashboard"
                    />
                    <div id="kereses" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center">Szerviz keresés (user alapján)</h2>
                        <div className="flex flex-col">
                            <div id="kereso-mezo" className="w-full py-3 text-lg pr-4">
                                <label htmlFor="productname" className="text-base">Adj meg felhasználónevet: </label>
                                <input type="text" name="productname" id="productname" className="text-black border-black border-2 bg-white rounded-xl px-2 h-10 w-full" placeholder="a felhasználónév"/>
                            </div>
                            <div id="allapotok" className=" py-3 text-lg pr-4 flex flex-col">
                                <label htmlFor="service-status">Adj meg egy állapotot!</label>
                                <select name="service-status" id="service-status" className="border-2 w-full border-black rounded-lg">
                                    <option value="folyamatban">folyamatban</option>
                                    <option value="kesz">kész</option>
                                </select>
                            </div>
                            <div id="kereses-gomb" className=" flex items-center justify-center pr-4">
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-3 py-2 rounded-lg    hover:font-bold">Keresés!</button>
                            </div>
                        </div>
                    </div>
                    <div id="free-time-insert" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center underline">Szabad szervizidőpont hozzáadása</h2>
                        <Form method="post">
                            <div id="free-service-date" className="flex flex-col gap-3">
                                <label htmlFor="freedateinsert">Adj meg egy szabad szerviz időpontot: </label>
                                <input type="datetime-local" name="freedateinsert" id="freedateinsert" className="text-black border-black border-2 bg-white rounded-xl px-2 h-10"/>
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-3 py-2 rounded-lg    hover:font-bold">Hozzáadás!</button>
                            </div>
                        </Form>
                        
                    </div>
                </div>
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
                                               
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                            Szerviz időpontok
                            </h1>
                           
                            <div className="flex items-center bg-amber-100 text-amber-700 px-2 py-1 sm:px-3 sm:py-1.2 rounded-full border border-amber-200">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                                {services.filter(s => !s.bringback_date).length}
                            </span>
                            <span className="ml-1 text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                folyamatban
                            </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {error && <div className="text-red-500 bg-red-200 p-2 rounded">{error}</div>}
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-100 text-gray-500 text-base">
                                        <th className="py-3 px-2">Ügyfél</th>
                                        <th className="py-3 px-2">Beadás</th>
                                        <th className="py-3 px-2">Probléma</th>
                                        <th className="py-3 px-2">Ár (Ft)</th>
                                        <th className="py-3 px-2">Átvétel</th>
                                        <th className="py-3 px-2 text-center">Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-base">
                                    {services.map((s) => (
                                        <tr key={s.id} className="hover:bg-blue-50/30 transition-colors"></tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>

            </main>
        </>
    );
}