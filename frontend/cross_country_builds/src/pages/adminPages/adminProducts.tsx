import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditIcon from "@mui/icons-material/Edit";
import menoBringa from "../../assets/letöltés.jpg"

export default function ProductDashboard(){
    return(
        <>
            <main className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1">
                    <AdminSidebar 
                        link1_to="/admin/orders"
                        link1_innerText="Megrendelések Dashboard"
                        link2_to="/admin/dates"
                        link2_innerText="Szerviz Dashboard"
                        link3_to="/admin/"
                        link3_innerText="Felhasználók Dashboard"
                    />
               </div>

               <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
                    <div className="flex justify-start items-center mb-6">
                        <h1 className="text-sm md:text-2xl font-bold text-gray-800">Termékek kezelése</h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100 text-gray-500 text-sm uppercase">
                                    <th className="py-3 px-2">Termék</th>
                                    <th className="py-3 px-2 text-center">Kategória</th>
                                    <th className="py-3 px-2 text-center">Készlet</th>
                                    <th className="py-3 px-2 text-center">Ár</th>
                                    <th className="py-3 px-2 text-left">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-500 text-black text-base">
                                <tr className="hover:bg-blue-50/50 transition-colors">
                                       <td className="py-4 px-2">
                                            <div className="flex items-center gap-3">
                                                <img src={menoBringa} className=" hidden md:block w-10 h-10 rounded shadow-sm object-cover" alt="" />
                                                <span className="font-semibold text-gray-800">{/*{product.name}*/}Merida dual thrust</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-2 text-center text-gray-600">{/*{product.category}*/} Hegyikerékpár</td>
                                        <td className="py-4 px-2 text-center font-bold">
                                            <span>
                                                {/*{product.stock_number}*/} 6 db
                                            </span>
                                        </td>
                                        <td className="py-4 px-2 text-center font-medium">
                                               250000 {/*{product.price.toLocaleString()}*/} Ft
                                        </td>
                                        <td className="py-3 px-2 text-right flex flex-col md:flex-row">
                                        <div className="flex flex-col md:flex-row justify-end items-center gap-2">
                                            {/* Szerkesztés gomb - Szürke/Sötét */}
                                            <button className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95">
                                                <EditIcon sx={{ fontSize: 18 }} />
                                                <span className="md:hidden lg:inline">Szerkesztés</span>
                                            </button>

                                            {/* Törlés gomb - Piros */}
                                            <button className="flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95">
                                                <TrashIcon sx={{ fontSize: 18 }} />
                                                <span className="md:hidden lg:inline">Törlés</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
               </div>        
            </main>
        </>
    );
}