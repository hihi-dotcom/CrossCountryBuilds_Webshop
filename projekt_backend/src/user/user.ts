interface IUser{
    id: number | null,
    username: string,
    email: string,
    password: string,
    token: string | null
}

export class User implements IUser{
    id: number | null  = null
    username: string = ""
    email: string = ""
    password: string = ""
    token: string | null = null
    constructor(init: IUser){
        Object.assign(this, init as Partial<User>)
    }


};