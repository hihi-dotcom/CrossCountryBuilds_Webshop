import { redirect } from "react-router-dom";
import ProductService from "../services/ProductService";
import { ProductScheme } from "../components/validationSchemes/ProductScheme";

export async function createProductAction({request}: {request: Request}){
    const formD = await request.formData();
    const data = Object.fromEntries(formD);
    const result = ProductScheme.safeParse(data);
    if(!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        };
    };

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
        return {
            ok:ProductResult.ok,
            message: ProductResult.message,
        };
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
};

export async function UpdateProduct({request, params}:any){
    const data = await request.formData();

    const ProductData = {
        name: data.get("name"),
        category: data.get("category"),
        maker: data.get("maker"),
        price: data.get("price"),
        stock_number: data.get("stock_number")
    };
    
    const productId = params.id;
    try{
        const response = await ProductService.updateProductbyId(Number(productId), ProductData);
        
        if(!response.ok){
           return {message: response.message || "A termék módosítása közben szerverhiba történt."};
        }
         return redirect("/admin/products");
    }
    catch(err:any){
        console.log(`Hiba történt a módosításkor: ${err}`);

        return{
            message: err.message || "Váratlan szerverhiba!"
        }
    }
   
}

export function convertToBase64(file: File): Promise<string>{
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    })
}