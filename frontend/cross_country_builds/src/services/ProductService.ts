import type ProductCreds from "../models/models_for_services/product_models";

class ProductService{

    async createNewProduct(product: ProductCreds){
        const response = await fetch('http://localhost:3000/product', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        return await response.json();
    }


    async getProductbyId(id: number){
        const response = await fetch(`http://localhost:3000/product/${id}`);

        const respData = await response.json();

        return respData;
    };

    async getProducts(){
        const response = await fetch(`http://localhost:3000/products`);

        const respData = await response.json();

        return respData;
    };

    async deletProductById(id:number){
        const response = await fetch(`http://localhost:3000/product/${id}`, {
            method: "DELETE",
            headers: {
                'Content-Type':'application/json'
            }
        });

        return await response.json();
    };
};

export default new ProductService();