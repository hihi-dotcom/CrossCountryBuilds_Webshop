import { redirect } from "react-router-dom";
import ProductService from "../services/ProductService";

export async function createProductAction({request}: {request: Request}){
    const formD = await request.formData();

    const useJsonFormat = true;

    try{
        let payload;

        if (useJsonFormat) {
            const file = formD.get("image") as File;
            let base64Image = "";
            
            if (file && file.size > 0) {
                base64Image = await convertToBase64(file);
            }

            payload = {
                name: formD.get("name"),
                category: formD.get("category"),
                maker: formD.get("maker"),
                description: formD.get("description"),
                price: Number(formD.get("price")),
                stock_number: Number(formD.get("stock_number")),
                image: base64Image
            };
        } else {
           
            payload = formD;
        }
        const ProductResult = await ProductService.createNewProduct(payload, useJsonFormat);
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

 export function convertToBase64(file: File): Promise<string>{
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    })
}