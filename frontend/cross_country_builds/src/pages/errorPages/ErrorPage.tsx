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
        <main>
            <section>
                <div className="text-center mt-20 py-5 text-white text-shadow-4xl">
                    <h1 className="pb-8">{error_title}</h1>
                    <p className="text-lg pb-8">{error_message}</p>
                    <BackToWebShopButton/>
                </div>
            </section>
        </main>
    );
}