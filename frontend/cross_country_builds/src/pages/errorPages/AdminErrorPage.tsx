import {useRouteError, isRouteErrorResponse, useNavigate} from "react-router-dom";

export default function AdminErrorPage(){
    const err = useRouteError();
    const navi = useNavigate();

    let errMessage:string = "Váratlan hiba történt a rendszerben!";
    let errCode:number | string = "Hiba";
    let errDetails: string | undefined;

    if(isRouteErrorResponse(err)){
        errCode = err.status;
        errMessage = err.statusText || "Még nem ismert hiba!";
        errDetails = err.data?.message || "Hálózati hiba történt a művelet során!";
        if (err.status === 404){
            errMessage = "A keresett oldal nem található.";
        } 
        if (err.status === 503){
            errMessage = "A szerver jelenleg nem elérhető.";
        }
        else if(err instanceof Error){
            errMessage = err.message;
        } 
    }
    return(
        <>
            <main>
                <section>
                        <div id="admin_err_cont">
                            <h1>{errCode}</h1>
                            <p>{errMessage}</p>
                            <h3 className="text-lg font-bold">A hiba technikai részletei: </h3>
                            <p>
                                {errDetails}
                            </p>
                        </div>
                        <div id="admin_err_buttons">

                        </div>
                </section>
            </main>
        </>
    );
}