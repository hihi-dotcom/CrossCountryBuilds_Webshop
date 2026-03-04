import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import BackToWebShopButton from "../../components/buttonComponents/backtoWebshopButton";
import { HiExclamationCircle } from "react-icons/hi";

export default function ErrorPage() {
  const err = useRouteError();

  let error_title: string = "Hoppá! Valamilyen hiba történt.";
  let error_message: string = "Váratlan hiba történt a rendszerben. A szerelőink már dolgoznak rajta!";
  let error_code: string = "ERROR";

  if (isRouteErrorResponse(err)) {
    error_code = err.status.toString();
    if (err.status === 404) {
      error_title = "404 - Az oldal eltekert";
      error_message = "Sajnos a keresett oldal vagy termék elszublimált a ködben.";
    } else if (err.status === 500) {
      error_title = "500 - Belső szerverhiba";
      error_message = "A szerverünk elfáradt a nagy hegymenetben. Próbáld újra később!";
    } else if (err.status === 401) {
      error_title = "401 - Belépés megtagadva";
      error_message = "Ehhez a tartalomhoz nincs jogosultságod. Jelentkezz be!";
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center dark:bg-[#1a222f] px-4 py-8">
      <div className="max-w-md w-full text-center">

        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
            <HiExclamationCircle className="h-20 w-20 text-red-600 dark:text-red-500" />
          </div>
        </div>

 
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight dark:text-white md:text-5xl">
          {error_title}
        </h1>
        <p className="mb-10 text-lg font-light dark:text-gray-400">
          {error_message}
        </p>


        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <BackToWebShopButton />
        </div>

     
      </div>
    </section>
  );
}