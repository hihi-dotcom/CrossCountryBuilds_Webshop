import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined"
import EditIcon from "@mui/icons-material/Edit"

export default function UsersDashboard(){
    return(
        <>
            <main className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1">
                    <AdminSidebar 
                        link1_to="/admin/orders"
                        link1_innerText="Megrendelések Dashboard"
                        link2_to="/admin/dates"
                        link2_innerText="Szerviz Dashboard"
                        link3_to="/admin/products"
                        link3_innerText="Termékek Dashboard"
                    />
                    <div id="kereses" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center">User keresés (név alapján)</h2>
                        <div className="flex flex-row">
                            <div id="kereso-mezo" className="w-full py-3 text-lg pr-4">
                                <label htmlFor="productname" className="text-base px-2">Adj meg felhasználónevet: </label>
                                <input type="text" name="productname" id="productname" className="text-black border-black border-2 bg-white rounded-xl placeholder:px-2 h-10" placeholder="a felhasználónév"/>
                            </div>
                            <div id="kereses-gomb" className=" flex items-center justify-center pr-4">
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-3 py-2 rounded-lg    hover:font-bold">Keresés!</button>
                            </div>
                        </div>
                    </div>
               </div>



               <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
                    <div className="flex justify-start items-center mb-6">
                        <h1 className="text-sm md:text-2xl font-bold text-gray-800">Felhasználók kezelése</h1>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-100 text-gray-500 text-sm uppercase">
                                    <th className="py-3 px-2">Felhasználónév</th>
                                    <th className="py-3 px-2">E-mail</th>
                                    <th className="py-3 px-2">Jogosultság</th>
                                    <th className="py-3 px-2 text-left">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-500 text-black text-base">
                                <tr className="hover:bg-blue-50/50 transition-colors">
                                    <td className="py-3 px-2">Zsolti a béka</td>
                                    <td className="py-3 px-2">zsolti.beka@gmail.com</td>
                                    <td className="py-3 px-2 bg-blue-100 text-blue-700 rounded text-base font-bold">user</td>
                                    <td className="py-3 px-2 text-right flex flex-col md:flex-row">
                                        <div className="flex flex-col md:flex-row justify-end items-center gap-2">
                                            {/* 
                                            <button className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95">
                                                <EditIcon sx={{ fontSize: 18 }} />
                                                <span className="md:hidden lg:inline">Szerkesztés</span>
                                            </button>*/}

                                            
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