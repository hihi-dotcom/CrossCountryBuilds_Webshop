import AdminSidebar from "../../components/adminComponents/Admin_Orderssidebar";

export default function ProductDashboard(){
    return(
        <>
            <main className="min-h-screen py-10 px-12">
                <AdminSidebar 
                    link1_to="/admin/orders"
                    link1_innerText="Megrendelések Dashboard"
                    link2_to="/admin/dates"
                    link2_innerText="Szerviz Dashboard"
                    link3_to="/admin/"
                    link3_innerText="Felhasználók Dashboard"
                    />
            
            </main>
        </>
    );
}