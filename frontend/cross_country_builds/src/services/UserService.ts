import AuthService from "./AuthService";


class UserService{
    async deleteUserbyId(id: number){
        const response = await AuthService._request(`user/${id}`,{
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

   

    async getNormalUsers() {
        const response = await AuthService._request('users');
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Hiba a lekérés során.");
        }

        return await response.json();
    }
};


export default new UserService();