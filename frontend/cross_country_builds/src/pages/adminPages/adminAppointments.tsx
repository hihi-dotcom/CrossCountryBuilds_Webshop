
import { useState, useRef, useEffect } from "react";
import { Form, useLoaderData, useActionData, Link } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";

export default function AppointmentDashboard(){
    const initAppointments = useLoaderData();
    const actionData = useActionData();

   
    const [error, setError] = useState("");
    const [services, setServices] = useState(initAppointments);

    useEffect(() => {
        setServices(initAppointments);
    }, [initAppointments]);

    const usrNameRef = useRef<HTMLInputElement>(null);
    const AppointmentStatusRef = useRef<HTMLSelectElement>(null);
    function handleSearchingAppointment(){
        const searchedUsr = usrNameRef.current?.value;
        const appointStat = AppointmentStatusRef.current?.value;

        if(!searchedUsr || !appointStat){
            setServices(initAppointments);
            return;
        }

        const filteredServices = initAppointments.filter((service:any) => service.customer_name.includes(searchedUsr) && service.status.includes(appointStat));

        setServices(filteredServices);
    }

    


    return(
        <>
            <section className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-50">
                <div className="lg:col-span-1">
                    <div id="kereses" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center">Szerviz keresés (user alapján)</h2>
                        <div className="flex flex-col">
                            <div id="kereso-mezo" className="w-full py-3 text-lg pr-4">
                                <label htmlFor="productname" className="text-base">Adj meg felhasználónevet: </label>
                                <input type="text" name="productname" id="productname" className="text-black border-black border-2 bg-white rounded-xl px-2 h-10 w-full" placeholder="a felhasználónév" ref={usrNameRef} onChange={handleSearchingAppointment}/>
                            </div>
                            <div id="allapotok" className=" py-3 text-lg pr-4 flex flex-col">
                                <label htmlFor="service-status">Adj meg egy állapotot!</label>
                                <select name="service-status" id="service-status" className="border-2 w-full border-black rounded-lg" ref={AppointmentStatusRef} onChange={handleSearchingAppointment}>
                                    <option value="folyamatban">folyamatban</option>
                                    <option value="kesz">kész</option>
                                </select>
                            </div>
                            <div id="kereses-gomb" className=" flex items-center justify-center pr-4">
                                <button type="submit" onClick={handleSearchingAppointment} className=" text-lg bg-[#08415c] text-white px-3 py-2 rounded-lg    hover:font-bold">Keresés!</button>
                            </div>
                        </div>
                    </div>
                    <div id="free-time-insert" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center underline">Szabad szervizidőpont hozzáadása</h2>
                        <Form method="post">
                            <div id="free-service-date" className="flex flex-col gap-3">
                                <label htmlFor="freedateinsert">Adj meg egy szabad szerviz időpontot: </label>
                                <input type="datetime-local" name="appointmentDate" id="freedateinsert" className="text-black border-black border-2 bg-white rounded-xl px-2 h-10"/>
                                {actionData?.errors?.appointmentDate && (
                                    <p className="text-red-500 text-sm font-bold">
                                        {actionData.errors.appointmentDate[0]}
                                    </p>
                                )}
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
                                {services.filter((s:any) => !s.bringback_date).length}
                            </span>
                            <span className="ml-1 text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                folyamatban
                            </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {error && <div className="text-red-500 bg-red-200 p-2 rounded">{error}</div>}
                            <table className="w-full text-left border-collapse text-black">
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
                                    {initAppointments.map((s:any) => (
                                      
                                            <tr key={s.id} className={s.bringback_date ? " bg-green-200 opacity-85" : "hover:bg-blue-50/30 transition-colors"}>
                                                <td className="py-4 px-2">{s.customer_name || "Szabad"}</td>
                                                <td className="py-4 px-2">{new Date(s.service_date).toLocaleString('hu-HU', { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                                <td className="py-4 px-2">{s.problem_description}</td>
                                                <td className="py-4 px-2">
                                                    <input type="number" name="price"  className="w-24 border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none" disabled={!(!!s.customer_name) || !!s.bringback_date} defaultValue={s.service_price || "---"}/>
                                                </td>
                                                <td className="py-4 px-2">
                                                    <input type="datetime-local" disabled name="bringBackDate" defaultValue={s.bringback_date ? s.bringback_date.substring(0, 16) : ""}  className="border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 outline-none"/>
                                                </td>
                                                <td className="py-4 px-2 text-center flex gap-3 flex-row">
                                                    {!!s.customer_name && !(!!s.bringback_date) &&(
                                                        <>
                                                            <Link to={`/admin/appointments/${s.id}`}  className="text-white bg-blue-600 hover:bg-blue-900 rounded-lg py-2 px-2"  >Kész!</Link>
                                                        </>
                                                    )}
                                                    {s.bringback_date && s.service_price && (
                                                        <>
                                                          <div className="flex flex-1 items-center justify-center text-4xl">
                                                            <FaCheck className=" text-green-700 "/>
                                                          </div>
                                                        </>
                                                    )}
                                                    {/* <button className="text-white bg-red-500 py-2 px-3 rounded-lg" disabled={s.bringback_date}>Törlés</button> */}
                                                </td>
                                            </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>

            </section>
        </>
    );
}