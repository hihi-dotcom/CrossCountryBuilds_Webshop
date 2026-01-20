import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";

export default function AppointmentDashboard(){


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

    const handleUpdate = (id:number, field:string, value:string | number) => {
    setServices(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };
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
                </div>
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
                                                {/* FEJLÉC JAVÍTÁSA */}
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                            Szerviz időpontok
                            </h1>
                            {/* Mobilon csak egy kis kör és szám, sm felett teljes szöveg */}
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