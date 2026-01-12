class OrderService{
    async MakingOrder(order: any){
        const resp = await fetch("http://localhost:3000/order", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        })
    }
};

export default new OrderService();