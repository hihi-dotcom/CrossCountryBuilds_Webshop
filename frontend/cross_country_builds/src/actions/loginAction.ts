export async function LoginAction(prevState:any, formData:any){
    const username = formData.get("felhasznalonev");
    const password = formData.get("jelszo");


    const loginData = {
        "username": username,
        "password": password
    }

}