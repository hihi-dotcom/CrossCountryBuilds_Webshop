class Guest{
    guest_id: number;
    name: string;
    email: string;
    password: string;
    ship_address!: string;
    bill_address!: string;
    

    public constructor(guest_id: number, name: string, email: string, password: string){
        this.guest_id = guest_id;
        this.name = name;
        this.email = email;
        this.password = password; 
    }

}