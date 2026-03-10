export interface LogInRespDTO{
   ok: boolean, 
   message:string,
   username?:string
   data?: {token: string, role:string}
}