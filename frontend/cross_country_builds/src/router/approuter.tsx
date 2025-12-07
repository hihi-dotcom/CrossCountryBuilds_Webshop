import {BrowserRouter, Routes, Route} from "react-router-dom"
import CartPage  from "../pages/CartPage";
import CreateNewPasswordPage from "../pages/CreateNewPassword";
import DateTimePage from "../pages/DatetimePage";
import GetNewPasswordPage from "../pages/GetNewPasswordPage";
import HomePage from "../pages/HomePage";
import LogInPage from "../pages/LoginPage";
import MyDataPage from "../pages/MyData";
import ProductPage from "../pages/ProductPage";
import OrderDataPage from "../pages/OrderData";
import RegistrationPage from "../pages/RegisPage";

import UsersDashboard from "../pages/adminPages/adminUsers";
import OrdersDashboard from "../pages/adminPages/adminOrders";
import AppointmentDashboard from "../pages/adminPages/adminAppointments";

import ProtectRouteAdmin from "../components/adminComponents/saferouteforadmin";

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
                <Route path="/orderData" element={<OrderDataPage/>}/>
                <Route path="/appointment" element={<DateTimePage/>} />
                <Route path="/getnewpass" element={<GetNewPasswordPage/>}/>
                <Route path="/login" element={<LogInPage/>}/>
                <Route path="/mydata" element={<MyDataPage/>}/>
                <Route path="/signup" element={<RegistrationPage/>}/>
                <Route path="/product/:termeknev" element={<ProductPage/>}/>

                <Route path="/admin/users" element={
                    <ProtectRouteAdmin>
                        <UsersDashboard/>
                    </ProtectRouteAdmin>
                }/>

                <Route path="/admin/orders" element={
                    <ProtectRouteAdmin>
                        <OrdersDashboard/>
                    </ProtectRouteAdmin>
                }/>

                <Route path="/admin/appointments" element={
                    <ProtectRouteAdmin>
                        <AppointmentDashboard/>
                    </ProtectRouteAdmin>
                }/>
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}