import TrashIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PenIcon from "@mui/icons-material/Edit";
import { HiCheck } from "react-icons/hi";
import { Form, useLoaderData, useActionData, Link } from "react-router-dom";
import { useState, useRef } from "react";
import ProductService from "../../services/ProductService";
import type Product from "../../models/product";
import DeleteModal from "../../components/modalComponents/adminModalComponents/AreyouSureDeleteModal";

export default function ProductDashboard(){
    const actionData = useActionData();
    const initProducts = useLoaderData();
    const [products, setProducts] = useState<Product[]>(initProducts);
    const [error, setError] = useState("");
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
    const [deleteTargetName, setDeleteTargetName] = useState<string | null>(null);

    async function handleDeleteProduct(id:number, productname:string){
        try{
            const deleteResult = await ProductService.deleteProductById(id);
            if(deleteResult.ok){
                setProducts(prev => prev.filter(p => p.id !== id));
                setDeleteTargetId(null);
            }
            else{
                setError(deleteResult.message || "A termék törlése sikertelen volt!");
            }
        }
        catch(error){
            setError("Váratlan hiba a termék törlése közben!");
            console.log(error); 
        }
    }
    const productNameRef = useRef<HTMLInputElement>(null);
    function handleSearchforProduct(){
        const searchedProduct =  productNameRef.current?.value 

        if(!searchedProduct){
            setProducts(initProducts);
            return;
        }

        const filteredProducts = initProducts.filter((product:Product) => product.name.includes(searchedProduct));
        setProducts(filteredProducts);
    }
    return(
        <>
            <DeleteModal isOpen={deleteTargetId !== null } 
                onClose={() => {
                    setDeleteTargetId(null);
                    setDeleteTargetName(null);
                    }}>
                <h2 className="text-2xl font-bold">Biztosan törölni akarod ezt a terméket?</h2>
                <p className=" text-lg opacity-90">{deleteTargetName}</p>
                <p className=" text-lg opacity-90"> Ez a művelet végleges, nem vonható vissza.</p>
                <div className="flex gap-4">
                    <button className="bg-red-600 hover:bg-red-800 text-white  hover:font-bold rounded-xl transition-colors py-3 px-4 "
                    onClick={() => deleteTargetId && handleDeleteProduct(deleteTargetId, deleteTargetName!)}>
                        Igen, töröld!
                    </button>
                </div>
            </DeleteModal>
            <section className="min-h-screen py-6 px-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
               <div className="lg:col-span-1">
                    <div id="kereses" className="rounded-xl py-2 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit ">
                        <h2 className="text-2xl text-center">Termék keresés (név alapján)</h2>
                        <div className="flex flex-row">
                            <div id="kereso-mezo" className="w-full py-3 text-lg pr-2">
                                <label htmlFor="productname" className="px-2">Add meg a termék nevét:</label>
                                <input type="text" name="productname" id="productname" className="text-black border-black border-2 bg-white rounded-xl px-2 h-10" placeholder="a termék neve" ref={productNameRef} onChange={handleSearchforProduct}/>
                            </div>
                            <div id="kereses-gomb" className=" flex items-center justify-center">
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-1 py-1 rounded-lg    hover:font-bold" onClick={handleSearchforProduct}>Keresés!</button>
                            </div>
                        </div>
                    </div>
                    <div id="insertnewtermek" className=" py-3 px-3 border-2 text-black mt-15 border-black flex flex-col h-fit rounded-xl">
                        <h2 className="text-2xl text-center"> Új termék hozzáadása</h2>
                        <Form method="post" className="py-4 flex flex-col gap-4" encType="multipart/form-data">

                            <div >
                                <label htmlFor="prodname">Add meg a termék nevét:</label>
                                <input type="text" name="name" id="prodname" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék neve"/>
                            </div>
                            <div>
                                <label htmlFor="prodcat">Add meg a kategóriát:</label>
                                <input type="text" name="category" id="prodcat" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék kategóriája"/>
                            </div>
                            <div>
                                <label htmlFor="prodmaker">Add meg a termék gyártóját:</label>
                                <input type="text" name="maker" id="prodmaker" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék gyártója"/>
                            </div>
                            <div>
                                <label htmlFor="proddesc">Add meg a termék leírását:</label>
                                <input type="text" name="description" id="proddesc" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék leírása"/>
                            </div>
                            <div>
                                <label htmlFor="prodpic">Add meg a termék képét:</label>
                                <input type="file" name="image" id="prodpic" className="text-black border-black border-2 bg-white rounded-xl px-3 h-fit w-full placeholder:text-black"/>
                            </div>
                            <div>
                                <label htmlFor="prodprice">Add meg a termék árát:</label>
                                <input type="number" name="price" id="prodprice" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék ára"/>
                            </div>
                            <div>
                                 <label htmlFor="prodstock">Hány darab van ebből a termékből?</label>
                                <input type="number" name="stock_number" id="prodstock" className="text-black border-black border-2 bg-white rounded-xl px-3 h-10 w-full placeholder:text-black" placeholder="a termék darabszáma"/>
                            </div>
                            {actionData?.message && (
                                <>
                                    <p className="text-green-500 text-sm font-black uppercase italic ml-1 tracking-tighter flex justify-center gap-1">
                                        <HiCheck className="h-4 w-4" /> {actionData.message}
                                    </p>
                                </>
                               
                            )}
                             <div id="hozzaadas-gomb" className=" flex items-center justify-center">
                                <button type="submit" className=" text-lg bg-[#08415c] text-white px-2 py-2 rounded-lg    hover:font-bold">Hozzáad!</button>
                            </div>
                        </Form>
                    </div>

                </div>
               
               <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-sm border mt-15 border-gray-200">
                    <div className="flex justify-center items-center mb-6">
                        <h1 className="text-sm md:text-2xl font-bold text-gray-800 justify-center">Termékek kezelése</h1>
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
                                {products.map((product) => (
                                        <tr className="hover:bg-blue-50/50 transition-colors" key={product.id}>
                                        <td className="py-4 px-2">
                                                <div className="flex items-center gap-3">
                                                    <img src={`http://localhost:3000/uploads/${product.picUrl}`} className=" hidden md:block w-10 h-10 rounded shadow-sm object-cover" alt="" />
                                                    <span className="font-semibold text-gray-800">{product.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-2 text-center text-gray-600">{product.category}</td>
                                            <td className="py-4 px-2 text-center font-bold">
                                                <span data-testid="stock_number">
                                                    {product.stock_number} 
                                                </span>
                                            </td>
                                            <td className="py-4 px-2 text-center font-medium">
                                               {product.price.toLocaleString()} Ft
                                            </td>
                                            <td className="py-3 px-2 text-center flex flex-col md:flex-row">
                                            <div className="flex flex-col md:flex-row justify-content-end items-center gap-2"> 
                                                <button className="flex items-center justify-right gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95" onClick={() => {
                                                    setDeleteTargetId(product.id);
                                                    setDeleteTargetName(product.name);
                                                    }}>
                                                    <TrashIcon sx={{ fontSize: 18 }} />
                                                    <span className="md:hidden lg:inline">Törlés</span>
                                                </button>
                                                <Link to={`/admin/products/${product.id}`} className="flex flex-col md:flex-row  justify-center items-center gap-1 bg-blue-600 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm w-full md:w-auto active:scale-95"><PenIcon sx={{ fontSize: 18 }} /> <span className="md:hidden lg:inline">Szerkesztés</span></Link>
                                            </div>
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