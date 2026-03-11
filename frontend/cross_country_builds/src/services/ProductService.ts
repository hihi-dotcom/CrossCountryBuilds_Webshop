import AuthService from "./AuthService";
import Product from "../models/product";
import { GetProductsRespDTO } from "../dtos/GetProductsRespDTO";
import { CreateNewProductRespDTO } from "../dtos/CreateNewProductRespDTO";
import { DeleteProductRespDTO } from "../dtos/DeleteProductRespDTO";
import { UpdateProductRespDTO } from "../dtos/UpdateProductRespDTO";
import Filters from "../models/filters";

const API_URL = "http://localhost:3000/api";

class ProductService {

    async getProducts(limit: number = 15, offset: number = 0, filters:Filters = {}):Promise<GetProductsRespDTO>{
        const params = new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
        });

        Object.entries(filters).forEach(([key, value]) => {
            if(value !== undefined && value !== "" && value !== null && value !== 0){
                params.append(key, value.toString());
            }
        })


        const response = await fetch(`${API_URL}/products?${params}`);
        const data = await response.json();
        
     
        return {
            ok: response.ok,
            products: data.product || [], 
            total: data.total || 0,
            hasMore: data.hasMore
        };
    }


    async getProductById(id: number):Promise<Product | null>{
        const response = await fetch(`${API_URL}/product?id=${id}`);
        const data = await response.json();
        
        
        return data.length > 0 ? data[0] : null;
    }



    async getAdminProducts():Promise<Product[] | []>{
        const response = await AuthService._request("admin/products");
        const respD = await response.json();
        if (!response.ok){
            throw new Error(respD.message || "Hiba a termékek lekérésekor! ");
        } 
        return respD;
    }

    async createNewProduct(Indata:Product, isJson:boolean = false):Promise<CreateNewProductRespDTO>{
        const fetchOptions: any = {
            method: "POST",
            body: isJson ? JSON.stringify(Indata) : Indata
        };

        if(isJson){
                fetchOptions.headers = {
                    "Content-Type": "application/json"
                }
        }
        const response = await AuthService._request("product", fetchOptions);

        const data = await response.json();

        if(!response.ok){
            throw new Error(data.message || "Hiba a termék feltöltése közben! ")
        }
        return {
            ok: response.ok,
            message: data.message,
            id: data.id
        };
    }

    async deleteProductById(id: number):Promise<DeleteProductRespDTO>{
        const response = await AuthService._request(`product?id=${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        return {
            ok: response.ok,
            message: data.message
        };
    };

    async updateProductbyId(id:number, data:Product):Promise<UpdateProductRespDTO>{
        const response = await AuthService._request(`admin/products?id=${id}`,{
            method: "PATCH",
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if(!response.ok){
             throw new Error(result.message || "A termék módosítása közben szerverhiba történt.");
        }
        return {
            ok: response.ok,
            message: result.message
        }
    }
}

export default new ProductService();