import Navbar from "../components/layout/navbar/navbarComponent";
import Footer from "../components/layout/footer/footerComponent";
import { Outlet, useRouteError } from "react-router-dom";
import { ToastProvider } from '../components/custom_hooks/ToastContext';

export default function RootLayout(){

    const error = useRouteError();
    return(
        <>
            <ToastProvider>
                <div className="min-h-screen flex flex-col bg-gray-50">
                    {!error && <Navbar/>}
                    <main className="grow">
                        <Outlet/>
                    </main>
                    <Footer/>
                </div>
            </ToastProvider>
        </>
    );
}