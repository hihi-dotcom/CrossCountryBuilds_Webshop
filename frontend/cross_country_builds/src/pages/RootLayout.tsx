import Navbar from "../components/layout/navbar/navbarComponent";
import { Footer } from "../components/layout/footer/footerComponent";
import { Outlet } from "react-router-dom";

export default function RootLayout(){
    return(
        <>
            <Navbar/>
            <main className="grow">
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}