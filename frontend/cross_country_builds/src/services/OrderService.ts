import type {OrderCreds}  from "../models/models_for_services/order_models"

class OrderService{
    async MakingOrder(order: OrderCreds){
        const resp = await fetch("http://localhost:3000/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        const respData = resp.json();

        return respData;
    };

    async deleteOrderbyId(id: number){
        const resp = await fetch(`http://localhost:3000/order/${id}`,{
            method: "DELETE",
            headers:{
                'Content-Type': 'application/json'
            }
        });

        const respData = await resp.json();

        return respData;
    }
};

export default new OrderService();