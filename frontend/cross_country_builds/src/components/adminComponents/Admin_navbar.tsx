import AdminLogoutButton from "./adminButtons/LogoutButtonforAdmin";

export default function Admin_Navbar(){
    return(
        <>
            <nav className="bg-[#08415c] fixed w-full z-20 top-0 start-0 border-b border-default">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                   
                </div>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-neutral-primary">
                    <li>
                        <p>Admin - Username</p>
                    </li>
                    <li>
                        <AdminLogoutButton/>
                    </li>
                </ul>
                </div>
            </div>
            </nav>

        </>
    );
}