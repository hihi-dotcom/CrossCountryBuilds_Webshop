import { DeleteOrderRespDTO } from "../dtos/DeleteOrderRespDTO";
import { MakingOrderRespDTO } from "../dtos/MakingOrderRespDTO";
import type {UpdateStatDTO}  from "../dtos/models_for_services/order_models"
import { UpdateOrderStatRespDTO } from "../dtos/UpdateOrderStatRespDTO";
import Order from "../models/order";
import AuthService from "./AuthService";

class OrderService{
    async MakingOrder(order:Order):Promise<MakingOrderRespDTO>{
        const response = await AuthService._request(`order`, {
            method: "POST",
            body: JSON.stringify(order)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message,
            
        }
    };

    async UpdateOrderStat(id: number,data:UpdateStatDTO):Promise<UpdateOrderStatRespDTO>{
        const response = await AuthService._request(`order?id=${id}`, {
            method: "PATCH",
            body: JSON.stringify(data)
        });

        const respData = await response.json();

        return{
            ok: response.ok,
            message: respData.message
        }
    }

    async deleteOrderbyId(id: number):Promise<DeleteOrderRespDTO>{

        const response = await AuthService._request(`order?id=${id}`, {
            method: "DELETE"
        });
      
        const respData = await response.json();

        return {
            ok: response.ok,
            message: respData.message
        };
    };

    async getOrdersforAdmin():Promise<Order[]>{
        const response = await AuthService._request(`admin/orders`, {
            method: "GET"
        });
        const responseData = await response.json()
        if(!response.ok){
            
            throw new Error(responseData.message || "Hiba a megrendelések lekérésekor! ");
        }
        return await responseData;
    }
};

export default new OrderService();