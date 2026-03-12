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
import { EditAppointmentPage } from "../pages/adminPages/adminAppointmEdit";
import AdminErrorPage from "../pages/errorPages/AdminErrorPage";

import ProtectRouteAdmin from "../pages/protects/saferouteforadmin";
import UserService from "../services/UserService";
import DateTimeService from "../services/DateTimeService";
import ProductService from "../services/ProductService";
import Contacts from "../pages/ContactsPageOnlyMobile";

import { loginAction, registerAction, logoutAction } from "../actions/authActions";
import AuthService from "../services/AuthService";
import OrderService from "../services/OrderService";
import ProtectRouteUser from "../pages/protects/ProtectiveRouteUser";
import PublicOnlyRoute from "../pages/protects/ProtectPublicOnly";
import { appointmentLoader, serviceDateTimeAction, UpdateAppointment } from "../actions/serviceActions";
import { getPassEmailAction, createPassAction } from "../actions/passwordActions";
import { MakeOrder } from "../actions/orderActions";
import { productLoader, UpdateProduct } from "../actions/productActions";
import { createProductAction } from "../actions/productActions";
import { createEmptyAppointmentAction } from "../actions/serviceActions";
import CartGuard from "../pages/protects/CartGuard";
import { EditProductPage } from "../pages/adminPages/AdminProductEdit";
import {appointmentLoaderById} from "../actions/serviceActions";
import { adminLoader } from "../pages/protects/adminLoader";

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
                    { path: "cart", element: <CartPage /> },
                    {
                        element: <PublicOnlyRoute />,
                        children: [
                            { path: "login", action: loginAction, element: <LogInPage /> },
                            { path: "signup", action: registerAction, element: <RegistrationPage /> },
                            { path: "getnewpass",action: getPassEmailAction ,element: <GetNewPasswordPage /> },
                            { path: "createnewpass",action: createPassAction ,element: <CreateNewPasswordPage /> },
                        ]
                    },
                   

                    { path: "contacts", element: <Contacts /> },
                    { path: "product/:id",loader:productLoader, element: <ProductPage /> },

                    {
                        element: <ProtectRouteUser />,
                        children: [
                            { path: "mydata", element: <MyDataPage /> },
                            {
                                element: <CartGuard/>,
                                children: [
                                    { path: "orderData",action: MakeOrder ,  element: <OrderDataPage /> }
                                ]
                            },
                            { path: "orderend", element: <EndofOrderPage /> },
                            { path: "appointment",
                                action: serviceDateTimeAction,
                                loader: appointmentLoader,
                            element: <DateTimePage /> },
                        ]
                    },
                    { path: "*", element: <ErrorPage /> }
                ]
            }
        ]
    },

    
    {
        path: "/admin",
        id: "admin",
        element: <ProtectRouteAdmin />,
        loader: adminLoader, 
        errorElement: <AdminErrorPage />,
        children: [
            { 
                index: true, 
                element: <UsersDashboard />,
                
                loader: async() => {
                    return await UserService.getNormalUsers();
                }
            },
            { 
                path: "orders", 
                element: <OrdersDashboard />,
                loader: async() => {
                   return await OrderService.getOrdersforAdmin();
                }
            },
            { 
                path: "dates", 
                element: <AppointmentDashboard />,
                action: createEmptyAppointmentAction,
                loader: async() => {
                    return await DateTimeService.getAppointmentsforAdmin();
                }
            },
            { 
                path: "products", 
                element: <ProductDashboard />,
                action: createProductAction ,
                loader: async() => {
                    return await ProductService.getAdminProducts();
                } 
            },
            {
                path: "products/:id",
                element: <EditProductPage/>,
                loader: productLoader,
                action: UpdateProduct
            },
            {
                path:"appointments/:id",
                element: <EditAppointmentPage/>,
                loader: appointmentLoaderById,
                action: UpdateAppointment
            }
        ]
    }
];

export default routes;