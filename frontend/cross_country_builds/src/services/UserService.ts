class UserService{
    async deleteUserbyId(id: number){
        const response = await fetch(`http://localhost:3000/user/${id}`,{
            method: "DELETE",
            headers:{
                'Content-Type': 'application/json'
            },
        });

        return await response.json();
    };

    async deleteUserbyEmail(email: string){
        const response = await fetch(`http://localhost:3000/user?${email}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return await response.json();
    }

    async getUsers(){
        const response = await fetch(`http://localhost:3000/users`);
        const respData = await response.json();
        return respData;
    }
}