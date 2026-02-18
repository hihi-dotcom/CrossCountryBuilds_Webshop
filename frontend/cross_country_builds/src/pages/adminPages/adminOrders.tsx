import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import { Form, useLoaderData } from "react-router-dom";
import { useState } from "react";

import CheckIcon from "@mui/icons-material/Check";
import OrderService from "../../services/OrderService";
import AdminProductModal from "../../components/modalComponents/adminModalComponents/adminProductsModal";
import DeleteModal from "../../components/modalComponents/adminModalComponents/AreyouSureDeleteModal";

export default function OrdersDashboard(){
         const initOrders = useLoaderData();
         const [orders, setOrders] = useState<any[]>(initOrders || []);
         const [loadingId, setLoadingId] = useState<number | null>(null);
         const [error, setError] = useState("");
         const [selectedOrderItems, setSelectedOrderItems] = useState<any[] | null>(null);
         const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
        /*  const [orders, setOrders] = useState([
            {
            id:1,
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
        ]);*/

        async function handleUpdateStatus(id:number, newStatus: string) {
            setLoadingId(id);
            setError("");
            try{
                const result = await OrderService.UpdateOrderStat(id, {status: newStatus});

                if(result.ok){
                   setOrders((prev:any) => 
                        prev.map((order:any) =>
                            order.id === id ? {...order, status: newStatus } : order 
                        )
                    );
                   
                }
                else{
                    setError(result.message || "Hiba történt a státusz frissítésekor!")
                }
            }
            catch(err){
                setError("Hálozati hiba a státusz frissítés közben!" + err);
                console.log(err);
            }
            finally{
                setLoadingId(null);
            }
        }
        /*
        async function handleDeleteOrder(id:number){
            try{
                const deleteResult = await OrderService.deleteOrderbyId(id);
                if(deleteResult.ok){
                    setOrders(prev => prev.filter((order) => order.id !== id))
                    setDeleteTargetId(null)
                }
                else{
                    setError(deleteResult.message || "A megrendelés törlése!");
                }
            }
            catch(error){
                setError("Váratlan hiba történt a megrendelés törlése közben!");
                console.log(error);
            }
        }*/
    return(
        <>
            <AdminProductModal
                isOpen={selectedOrderItems !== null} 
                onClose={() => setSelectedOrderItems(null)}
            >
                <div className="w-full">
                    <h3 className="text-xl font-bold mb-6 border-b pb-2">Megrendelt termékek</h3>
                   <div className="space-y-2">
                        {selectedOrderItems?.map((item: any) => (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-center p-4 bg-white/5 rounded-xl border border-black/5 shadow-sm">
                                <div className="col-span-6 border-r border-black/10 pr-4">
                                    <span className="font-bold text-gray-800 whitespace-nowrap">{item.p_name}</span>
                                </div>
                                <div className="col-span-2 border-r border-black/10 text-center">
                                    <span className="font-medium text-black bg-gray-100 px-2 py-1 rounded-md">
                                        {item.quantity} db
                                    </span>
                                </div>
                                <div className="col-span-4 text-right font-bold text-black">
                                    {item.p_price.toLocaleString()} Ft
                                </div>
                            </div>
                        ))}
                </div>
                </div>
            </AdminProductModal>
            <DeleteModal isOpen={deleteTargetId !== null} 
                onClose={() => setDeleteTargetId(null)}>
                    <>
                        <h2 className="text-2xl font-bold">
                            Biztosan törölni akarod, ezt a rendelést?
                        </h2>
                        <div className="flex gap-4">
                            <button className="bg-red-600 hover:bg-red-800 text-white  hover:font-bold rounded-xl transition-colors py-3 px-4 "
                            >
                                Igen, töröld a rendelést!
                            </button>
                        </div>
                    </>
            </DeleteModal>
            <section className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6 bg-gray-50">
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
                           
                        </div>
                        <div className="w-full overflow-x-auto shadow-inner rounded-lg">
                            {error && <div className="text-red-500 bg-red-200 p-2 rounded">{error}</div>}
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
                                        <tr key={s.id}  className={loadingId === s.id ? "opacity-50" : ""}>
                                              <td className="py-4 px-2 font-medium w-fit">#{s.u_id} {s.customer_name}</td>
                                              <td className="py-4 px-2">{s.delivery_Method}</td>
                                              <td className="py-4 px-2">{s.payment_Method}</td>
                                              <td className="py-4 px-2 font-semibold">{Number(s.total_amount).toLocaleString()} Ft</td>
                                            <td className="py-4 px-2">
                                               <button onClick={() => setSelectedOrderItems(s.items)}  className="bg-blue-600 hover:bg-blue-800 text-white hover:font-bold py-2 px-3  flex flex-col md:flex-row items-center gap-1 transition-colors rounded-xl">
                                                <span>{s.items?.length || 0} termék</span>
                                                <span className="text-sm">(megtekintése)</span>
                                               </button>
                                            </td>
                                            <td className="py-4 px-2">
                                                <select value={s.status} onChange={(e) => {
                                                    const nextStatus = e.target.value;
                                                    setOrders(prev => prev.map(o => 
                                                        o.id === s.id ? { ...o, status: nextStatus } : o
                                                    ));
                                                }}>
                                                    <option value="pending">Feldolgozás alatt</option>
                                                    <option value="kész">Kész!</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-2 text-right flex flex-col gap-4">

                                                <button className="flex items-center justify-center gap-1 bg-black hover:shadow-2xl text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95" onClick={() => handleUpdateStatus(s.id, s.status)}>
                                                    <CheckIcon sx={{ fontSize: 18 }} />
                                                    <span className="md:hidden lg:inline">Lezárás</span>
                                                </button>
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