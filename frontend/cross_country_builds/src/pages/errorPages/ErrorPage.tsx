import {useRouteError, isRouteErrorResponse} from "react-router-dom";
import BackToWebShopButton from "../../components/buttonComponents/backtoWebshopButton";

export default function ErrorPage(){
    const err = useRouteError();

    let error_title:string = "Hoppá!";
    let error_message:string = "Valamilyen hiba történt a webshopban.";

    if(isRouteErrorResponse(err)){
        if(err.status === 404){
            error_title = "404 - Az oldal nem található";
            error_message = "Sajnos keresett a keresett termék vagy oldal elszublimált";
        }
    }

    return(
        <section className="min-h-screen flex items-center justify-center">
            <section>
                <div className="text-center py-5 text-white mx-auto px-4">
                    <h1 className="text-5xl pb-8 font-bold">{error_title}</h1>
                    <p className="text-2xl pb-12 opacity-90">{error_message}</p>
                    
                    {/* Ez a konténer kényszeríti középre a gombot */}
                    <div className="flex justify-center w-full">
                        <BackToWebShopButton />
                    </div>
                </div>
            </section>
        </section>
    );
}