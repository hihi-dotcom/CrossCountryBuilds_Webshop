import { redirect } from "react-router-dom";
import ProductService from "../services/ProductService";

export async function createProductAction({request}: {request: Request}){
    const formD = await request.formData();

    try{
        const ProductResult = await ProductService.createNewProduct(formD);
        if(!ProductResult.ok){
            return {serverError: ProductResult.message || "Hiba történt a termék feltöltése közben!"}
        }
        return redirect("/admin/products");
    }
    catch(error:any){
        return {serverError: error.message || "Hiba a termék feltöltése közben! "};
    }
}

export async function productLoader({params}:any){
    const id = params.id;

    const response = await ProductService.getProductById(Number(id));
    if(!response){
        throw new Response("A termék nem található", {status: 404});
    };

    return response;
}