import AuthService from "./AuthService";
import type ProductCreds from "../models/models_for_services/product_models";

const API_URL = "http://localhost:3000/api";

class ProductService {

    async getProducts(limit: number = 15, offset: number = 0) {
        const response = await fetch(`${API_URL}/products?limit=${limit}&offset=${offset}`);
        const data = await response.json();
        
     
        return {
            ok: response.ok,
            products: data.product, 
            total: data.total,
            hasMore: data.hasMore
        };
    }


    async getProductById(id: number) {
        const response = await fetch(`${API_URL}/product?id=${id}`);
        const data = await response.json();
        
        
        return data.length > 0 ? data[0] : null;
    }



    async getAdminProducts() {
        const response = await AuthService._request("admin/products");
        const respD = await response.json();
        if (!response.ok){
            throw new Error(respD.message || "Hiba a termékek lekérésekor! ");
        } 
        return respD;
    }

    async createNewProduct(Indata:any) {

        const response = await AuthService._request("product", {
            method: "POST",
            body: Indata
        });

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

    async deleteProductById(id: number) {
        const response = await AuthService._request(`product?id=${id}`, {
            method: "DELETE"
        });

        const data = await response.json();

        return {
            ok: response.ok,
            message: data.message
        };
    }
}

export default new ProductService();