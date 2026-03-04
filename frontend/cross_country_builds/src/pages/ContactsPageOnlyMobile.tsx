import BackToWebShopButton from "../components/buttonComponents/backtoWebshopButton";
import { MdPlace, MdPhone, MdEmail } from "react-icons/md";
import { Card } from "flowbite-react";

export default function Contacts() {
  return (
    <section className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-8 dark:bg-gray-900 sm:hidden">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Kapcsolat
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Keress minket bizalommal az alábbi elérhetőségeken!
        </p>
      </div>


      <div className="flex w-full flex-col gap-4">
        
        <Card className="border-none shadow-md">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <MdPlace size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Címünk</span>
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                1025 Budapest, Huhu u. 28.
              </p>
            </div>
          </div>
        </Card>

        
          <Card className="border-none shadow-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <MdPhone size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Telefon</span>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  06 1 334 5678
                </p>
              </div>
            </div>
          </Card>

       
          <Card className="border-none shadow-md hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <MdEmail size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">E-mail</span>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  info@menokerekparbolt.hu
                </p>
              </div>
            </div>
          </Card>
      </div>


      <div className="mt-auto w-full pt-12">
        <div className="flex flex-col items-center gap-4">
          <BackToWebShopButton />
         
        </div>
      </div>
    </section>
  );
}