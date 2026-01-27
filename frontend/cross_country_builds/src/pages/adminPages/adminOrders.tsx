import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import { Form } from "react-router-dom";
import { useState } from "react";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";

export default function OrdersDashboard(){
         const [loadingId, setLoadingId] = useState(null);
          const [orders, setOrders] = useState([
            {
            u_id: 2,
           d_method: "házhoz szállítás",
            p_method: "utánvét készpénzzel",
            total_amount: 500000,
            items:[
                {
                    p_name: "bicikli",
                    p_price: 350000
                }
            ],
            status: "kész"
            
            }
        ]);
    return(
        <>
            <main className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-50">
                <div className="lg:col-span-1">
                    <AdminSidebar 
                        link1_to="/admin/dates"
                        link1_innerText="Szerviz Dashboard"
                        link2_to="/admin/products"
                        link2_innerText="Termékek Dashboard"
                        link3_to="/admin/"
                        link3_innerText="Felhasználók Dashboard"
                    />
                </div>
                <div className="lg:col-span-3 bg-white  rounded-xl shadow-sm border mt-15 border-gray-200">
                                               
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <h2 className=" text-3xl md:text-4xl p-3 font-bold text-gray-800 tracking-tight ">
                            Megrendelések
                            </h2>
                           
                           {/* <div className="flex items-center bg-amber-100 text-amber-700 px-2 py-1 sm:px-3 sm:py-1.2 rounded-full border border-amber-200">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider">
                               
                            </span>
                            <span className="ml-1 text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:inline">
                                folyamatban
                            </span>
                            </div>
                            */}
                        </div>
                        <div className="w-full overflow-x-auto shadow-inner rounded-lg">
                            <table className="min-w-full md:w-full table-auto text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-100 text-gray-500 text-sm uppercase">
                                        <th className="py-3 px-2">Ügyfél azonosító</th>
                                        <th className="py-3 px-2">Szállítási mód</th>
                                        <th className="py-3 px-2">Fizetési mód</th>
                                        <th className="py-3 px-2">Végösszeg (Ft)</th>
                                        <th className="py-3 px-2">
                                            Termékek:
                                        </th>
                                        <th className="py-3 px-2">Állapota</th>
                                        <th className="py-3 px-2 text-center">Műveletek</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y px-2 divide-gray-100 text-base text-black">
                                    {orders.map((s) => (
                                        <tr key={s.u_id} className="hover:bg-blue-50/30 transition-colors divide-gray-600">
                                              <td className="py-4 px-2 font-medium w-fit">#{s.u_id}</td>
                                              <td className="py-4 px-2">{s.d_method}</td>
                                              <td className="py-4 px-2">{s.p_method}</td>
                                              <td className="py-4 px-2 font-semibold">{s.total_amount.toLocaleString()} Ft</td>
                                            <td className="py-4 px-2">
                                                <details className="cursor-pointer">
                                                    <summary className="text-blue list-none">
                                                        <span className="flex items-center gap-1">
                                                            {s.items.length} termék megtekintése
                                                           
                                                            <span className="group-open:rotate-180 transition-transform">▼</span>
                                                        </span>
                                                    </summary>
                                                    <div className="p-3 bg-gray-50 rounded-lg mt-2 shadow-inner text-xs border border-gray-100 min-w-[200px]">
                                                        {s.items.map((item, index) => (
                                                            <div key={index} className="flex justify-between border-b last:border-0 py-2 border-gray-200">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-gray-800">{item.p_name}</span>
                                                                   
                                                                </div>
                                                                <span className="font-semibold text-gray-700">{item.p_price.toLocaleString()} Ft</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </details>
                                            </td>
                                            <td className="py-4 px-2">
                                                <select 
                                                    value={orders[0].status} 
                                                   
                                                   
                                                    
                                                >
                                                    <option value="pending">Függőben</option>
                                                    <option value="processing">Feldolgozás alatt</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-2 text-right flex flex-col md:flex-row">
                                                <button className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95">
                                                    <TrashIcon sx={{ fontSize: 18 }} />
                                                    <span className="md:hidden lg:inline">Törlés</span>
                                                </button>
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                        </div>
                    </div>

            </main>
        </>
    );
}