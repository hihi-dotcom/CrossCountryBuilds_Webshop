class PasswordService{

    async sendPasswordBackEmail(email: string) {
        const response = await fetch("http://localhost:3000/recovery", {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(email)
        });

         return await response.json();
    };

    async createNewPassword(password: string){
        const response = await fetch("http://localhost:3000/recovery", {
            method: "PATCH",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(password)
        });

        return await response.json();
    };
};

export default new PasswordService();