class PasswordService{

    async SendPasswordBackEmail(email: string) {
        const response = await fetch("http://localhost:3000/recovery", {
            method: "POST",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(email)
        });
    }

    async CreateNewPassword(password: string){
        const response = await fetch("http://localhost:3000/recovery", {
            method: "PATCH",
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(password)
        })
    }
};

export default new PasswordService();