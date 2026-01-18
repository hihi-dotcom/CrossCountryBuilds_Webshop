import Navbar from "../components/layout/navbar/navbarComponent";
import { Footer } from "../components/layout/footer/footerComponent";
import { Outlet, useRouteError } from "react-router-dom";

export default function RootLayout(){

    const error = useRouteError();
    return(
        <>
            {!error && <Navbar/>}
            <main className="grow">
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}