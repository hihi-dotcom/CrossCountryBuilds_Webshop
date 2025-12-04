import {BrowserRouter, Routes, Route} from "react-router-dom"
import CartPage  from "../pages/CartPage";
import CreateNewPasswordPage from "../pages/CreateNewPassword";
import DateTimePage from "../pages/DatetimePage";
import GetNewPasswordPage from "../pages/GetNewPasswordPage";
import HomePage from "../pages/HomePage";
import LogInPage from "../pages/LoginPage";
import MyDataPage from "../pages/MyData";
import ProductPage from "../pages/ProductPage";
import RegistrationPage from "../pages/RegisPage";
import Navbar from "../components/layout/navbar/navbarComponent";
import { Footer } from "../components/layout/footer/footerComponent";
export default function AppRouter(){
    return(
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>}/>
                <Route path="/cart" element={<CartPage/>}/>
                <Route path="/createnewpass" element={<CreateNewPasswordPage/>} />
                <Route path="/appointment" element={<DateTimePage/>} />
                <Route path="/getnewpass" element={<GetNewPasswordPage/>}/>
                <Route path="/login" element={<LogInPage/>}/>
                <Route path="/mydata" element={<MyDataPage/>}/>
                <Route path="/registration" element={<RegistrationPage/>}/>
                <Route path="/product/:termeknev" element={<ProductPage/>}/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}