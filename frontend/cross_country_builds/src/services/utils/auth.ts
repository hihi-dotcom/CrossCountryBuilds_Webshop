    const API_url: string = `http://localhost:3000/api/`;
    
    
    export function getToken(): string | null {
        return localStorage.getItem("token");
    };

    export function removeToken(){
        localStorage.removeItem("token");
    };
    export function setToken(token:string): void{
        localStorage.setItem("token", token);
    }
    export async function requestHandler(endpoint: string, options : RequestInit = {}){
        const url =`${API_url}${endpoint}`;
        const token = getToken();

        const headers: Record<string, string> = { ...options.headers as Record<string, string> };

        if(!(options.body instanceof FormData)){
            headers['Content-Type'] = 'application/json';
        }

        if(token){
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if(response.status === 401){
            removeToken();
            if(!window.location.pathname.includes('/login')){
                window.location.href = '/login?expired=true'
            }
        };

        return response;

        
    }