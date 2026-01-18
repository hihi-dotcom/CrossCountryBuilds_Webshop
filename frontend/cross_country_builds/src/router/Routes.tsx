import RootLayout from "../pages/RootLayout";
import CartPage  from "../pages/CartPage";
import CreateNewPasswordPage from "../pages/CreateNewPassword";
import DateTimePage from "../pages/DatetimePage";
import GetNewPasswordPage from "../pages/GetNewPasswordPage";
import HomePage from "../pages/HomePage";
import LogInPage from "../pages/LoginPage";
import MyDataPage from "../pages/MyDataPage";
import ProductPage from "../pages/ProductPage";
import OrderDataPage from "../pages/OrderDataPage";
import RegistrationPage from "../pages/RegisPage";
import EndofOrderPage from "../pages/EndofOrderPage";
import ErrorPage from "../pages/errorPages/ErrorPage";


import UsersDashboard from "../pages/adminPages/adminUsers";
import OrdersDashboard from "../pages/adminPages/adminOrders";
import AppointmentDashboard from "../pages/adminPages/adminAppointments";
import ProductDashboard from "../pages/adminPages/adminProducts";
import AdminErrorPage from "../pages/errorPages/AdminErrorPage";

import ProtectRouteAdmin from "../pages/protects/saferouteforadmin";


import Contacts from "../pages/ContactsPageOnlyMobile";

import { loginAction, registerAction, logoutAction } from "../actions/authActions";
import AuthService from "../services/AuthService";
import ProtectRouteUser from "../pages/protects/ProtectiveRouteUser";
import PublicOnlyRoute from "../pages/protects/ProtectPublicOnly";
import { serviceDateTimeAction } from "../actions/serviceActions";

const rootLoader = async () => {
    return await AuthService.gettingCurrentUser();
}

const routes = [
    {
        path: "/",
        element: <RootLayout />,
        id: "root",
        loader: rootLoader,
        children: [
            {
                errorElement: <ErrorPage />,
                children: [
                    { index: true, element: <HomePage /> },
                    { path: "logout", action: logoutAction },
                    

                    {
                        element: <PublicOnlyRoute />,
                        children: [
                            { path: "login", action: loginAction, element: <LogInPage /> },
                            { path: "signup", action: registerAction, element: <RegistrationPage /> },
                            { path: "getnewpass", element: <GetNewPasswordPage /> },
                            { path: "createnewpass", element: <CreateNewPasswordPage /> },
                        ]
                    },
                   

                    { path: "contacts", element: <Contacts /> },
                    { path: "product/:id", element: <ProductPage /> },

                    {
                        element: <ProtectRouteUser />,
                        children: [
                            { path: "mydata", element: <MyDataPage /> },
                            { path: "orderData", element: <OrderDataPage /> },
                            { path: "orderend", element: <EndofOrderPage /> },
                            { path: "cart", element: <CartPage /> },
                            { path: "appointment",
                                action: serviceDateTimeAction,
                            element: <DateTimePage /> },
                        ]
                    },
                    { path: "*", element: <ErrorPage /> }
                ]
            }
        ]
    },

    
    {
        path: "admin",
        id: "admin",
        element: <ProtectRouteAdmin />,
        //loader: rootLoader, 
        errorElement: <AdminErrorPage />,
        children: [
            { index: true, element: <UsersDashboard /> },
            { path: "orders", element: <OrdersDashboard /> },
            { path: "dates", element: <AppointmentDashboard /> },
            { path: "products", element: <ProductDashboard /> }
        ]
    }
];

export default routes;