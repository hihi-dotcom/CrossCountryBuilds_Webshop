import AdminSidebar from "../../components/adminComponents/Admin_OrdersSidebar";
import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import menoBringa from "../../assets/letöltés.jpg";
import { Form, useLoaderData } from "react-router-dom";
import { useState, useRef } from "react";
import ProductService from "../../services/ProductService";
import type Product from "../../models/product";

export default function ProductDashboard(){
    const initProducts = useLoaderData();
    const [products, setProducts] = useState<Product[]>(initProducts);
    const [error, setError] = useState("");
    async function handleDeleteProduct(id:number){
        try{
            const deleteResult = await ProductService.deleteProductById(id);
            if(deleteResult.ok){
                setProducts(prev => prev.filter(p => p.id !== id))
            }
            else{

            }
        }
        catch(error){

        }
    }
    const productNameRef = useRef<HTMLInputElement>(null);
    function handleSearchforProduct(){
        const searchedUser =  productNameRef.current?.value 

        if(!searchedUser){
            setProducts(initProducts);
            return;
        }

        const filteredUsers = initProducts.filter((user:any) => user.username.includes(searchedUser));
        setProducts(filteredUsers);
    }
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
                    <div id="kereses" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center">Termék keresés (név alapján)</h2>
                        <div className="flex flex-row">
                            <div id="kereso-mezo" className="w-full py-3 text-lg pr-2">
                                <label htmlFor="productname" className="px-2">Add meg a termék nevét:</label>
                                <input type="text" name="productname" id="productname" className="text-black border-black border-2 bg-white rounded-xl placeholder:px-2 h-10" placeholder="a termék neve" ref={productNameRef} onChange={handleSearchforProduct}/>
                            </div>
                            <div id="kereses-gomb" className=" flex items-center justify-center">
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-2 py-2 rounded-lg    hover:font-bold" onClick={handleSearchforProduct}>Keresés!</button>
                            </div>
                        </div>
                    </div>
                    <div id="insertnewtermek" className=" py-3 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit rounded-xl">
                        <h2 className="text-2xl text-center"> Új termék hozzáadása</h2>
                        <Form method="post" className="py-4 flex flex-col gap-4">

                            <div >
                                <label htmlFor="prodname">Add meg a termék nevét:</label>
                                <input type="text" name="prodname" id="prodname" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék neve"/>
                            </div>
                            <div>
                                <label htmlFor="prodcat">Add meg a kategóriát:</label>
                                <input type="text" name="prodcat" id="prodcat" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék kategóriája"/>
                            </div>
                            <div>
                                <label htmlFor="prodmaker">Add meg a termék gyártóját:</label>
                                <input type="text" name="prodmaker" id="prodmaker" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék gyártója"/>
                            </div>
                            <div>
                                <label htmlFor="proddesc">Add meg a termék leírását:</label>
                                <input type="text" name="proddesc" id="proddesc" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék leírása"/>
                            </div>
                            <div>
                                <label htmlFor="prodpic">Add meg a termék képét:</label>
                                <input type="file" name="prodpic" id="prodpic" className="text-black border-black border-2 bg-white rounded-xl px-3 h-fit w-full placeholder:text-black"/>
                            </div>
                            <div>
                                <label htmlFor="prodprice">Add meg a termék árát:</label>
                                <input type="number" name="prodprice" id="prodprice" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék ára"/>
                            </div>
                            <div>
                                 <label htmlFor="prodstock">Hány darab van ebből a termékből?</label>
                                <input type="number" name="prodstock" id="prodstock" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék darabszáma"/>
                            </div>
                             <div id="hozzaadas-gomb" className=" flex items-center justify-center">
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-2 py-2 rounded-lg    hover:font-bold">Hozzáad!</button>
                            </div>
                        </Form>
                    </div>

                </div>
               
               <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
                    <div className="flex justify-start items-center mb-6">
                        <h1 className="text-sm md:text-2xl font-bold text-gray-800">Termékek kezelése</h1>
                    </div>

                    <div className="overflow-x-auto">
                        {error && <div className="text-red-500 bg-red-200 p-2 rounded">{error}</div>}
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
                                            {/*  
                                            <button className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95">
                                                <EditIcon sx={{ fontSize: 18 }} />
                                                <span className="md:hidden lg:inline">Szerkesztés</span>
                                            </button>
                                            */}

                                            
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