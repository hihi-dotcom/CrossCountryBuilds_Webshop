import { DeleteUserRespDTO } from "../dtos/DeleteUserRespDTO";
import Guest from "../models/guest";
import AuthService from "./AuthService";


class UserService{
    async deleteUserbyId(id: number):Promise<DeleteUserRespDTO>{
        const response = await AuthService._request(`user?id=${id}`,{
            method: "DELETE",
            
        });

        const data = await response.json();

        return {
            ok: response.ok,
            message: data.message 
        };
    };

    async deleteUserbyEmail(email: string){
        const response = await fetch(`http://localhost:3000/user?${email}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    };

   

    async getNormalUsers():Promise<Guest[] | []>{
        const response = await AuthService._request('admin/users');
        const responseData = await response.json();
        if (!response.ok) {
           
            throw new Error(responseData.message || "Hiba a felhasználók lekérése során.");
        }

        return await responseData;
    }
};


export default new UserService();