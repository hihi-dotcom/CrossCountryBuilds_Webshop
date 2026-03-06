import { useRouteLoaderData, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Banner, Modal, ModalHeader, ModalBody } from "flowbite-react";
import { HiExclamationCircle, HiCalendar, HiArrowRight } from "react-icons/hi";

export function DateTimeSection() {
  const user = useRouteLoaderData("root") as { id: number; role: string } | null;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  
  useEffect(() => {
    if (modalIsOpen) {
      const timer = setTimeout(() => { setModalIsOpen(false) }, 2500);
      return () => clearTimeout(timer);
    }
  }, [modalIsOpen]);

  function handleNavigateButtonClick() {
    if (!user) {
      setModalIsOpen(true);
    } else {
      navigate("/appointment");
    }
  }

  return (
    <>
     
      <Modal show={modalIsOpen} size="md" onClose={() => setModalIsOpen(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              A szerviz szolgáltatásunkhoz előbb be kell jelentkezned!
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={() => navigate("/login")}>
                Bejelentkezés
              </Button>
              <Button color="gray" onClick={() => setModalIsOpen(false)}>
                Mégse
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>

   
      <div className="w-full mt-5 bg-blue-600 rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-xl border-b-4 border-blue-800">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-blue-600 p-4 rounded-full text-white">
            <HiCalendar className="h-8 w-8" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-wide">
              Baj van a bringáddal?
            </h3>
            <p className="hidden sm:block text-blue-100 text-sm md:text-base mt-1">
              Hozd el hozzánk és mi megjavítjuk! Foglalj időpontot profi szervizünkbe akár most!
            </p>
          </div>
        </div>

        <Button
          color="light"
          size="xl"
          onClick={handleNavigateButtonClick}
          className="w-full md:w-auto font-bold uppercase tracking-tighter"
        >
          Foglalok!
          <HiArrowRight className="ml-2 h-5 w-5 text-blue-700" />
        </Button>
      </div>
    </>
  );
}