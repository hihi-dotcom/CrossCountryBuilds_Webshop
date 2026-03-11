export interface RegistrationDTO{
    username: string,
    email: string,
    password: string,
    confirmPassword: string
}

export interface LoginDTO{
    username: string,
    password: string
}