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
import UsersDashboard from "../pages/adminPages/adminUsers";
import OrdersDashboard from "../pages/adminPages/adminOrders";
import AppointmentDashboard from "../pages/adminPages/adminAppointments";

import ProtectRouteAdmin from "../components/adminComponents/saferouteforadmin";


import Contacts from "../pages/ContactsPageOnlyMobile";

const routes = [
        {
            path:"/",
            element: <RootLayout/>,
            id: "root",
            children:[
                {
                    index: true, 
                    element: <HomePage/>
                },
                {
                    path: "login", 
                    element: <LogInPage/>
                },
                {
                    path: "signup", 
                    element: <RegistrationPage/>
                },
                {
                    path: "getnewpass", 
                    element: <GetNewPasswordPage/>
                },
                {
                    path: "createnewpass", 
                    element: <CreateNewPasswordPage/>
                },
                {
                    path: "contacts", 
                    element: <Contacts/>
                },


                {
                    path: "product/:productname",
                    element: <ProductPage/>
                },

                
        {
            //Bejelentkezés kell ezekhez

            children: [
                        {
                            path: "mydata", 
                            element: <MyDataPage/>
                        },
                        {
                            path: "orderData", 
                            element: <OrderDataPage/>
                        },
                        {
                            path: "orderend", 
                            element: <EndofOrderPage/>
                        },
                        {
                            path: "cart", 
                            element: <CartPage/>
                        },
                        {
                            path: "date", 
                            element: <DateTimePage/>
                        },
                ]

        },
                

            ]
        },

        //admin oldalai
        {
            path:"admin",
            element: <ProtectRouteAdmin/>,
            children: [
                {
                    index:true,
                    element: <UsersDashboard/>
                },
                {
                    path:"orders",
                    element: <OrdersDashboard/>
                },
                {
                    path:"dates",
                    element: <AppointmentDashboard/>
                }
            ]
        }
];

export default routes;