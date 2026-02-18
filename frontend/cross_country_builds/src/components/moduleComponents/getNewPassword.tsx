import { Label, TextInput, Button, Card } from "flowbite-react";
import { HiMail, HiArrowLeft, HiExclamationCircle, HiPaperAirplane } from "react-icons/hi";
import { Link, Form, useActionData, useNavigation } from "react-router-dom";
import BackToWebShopButton from "../buttonComponents/backtoWebshopButton";

export default function GetNewPasswordModule() {
  const actionData = useActionData() as any;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      
  
      <Card className="w-full max-w-md border-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] bg-[#1e293b] rounded-[2.5rem] p-4 md:p-8">
        

        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
            Új <span className="text-blue-500">jelszó</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm font-bold uppercase italic tracking-widest leading-relaxed">
            Add meg az e-mail címed, és elküldjük a visszaállító linket!
          </p>
        </div>

        
        <Form method="post" className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label className="text-[11px] font-black uppercase text-gray-500 tracking-widest ml-1">
              Email címed
            </Label>
            <TextInput
              id="newpassword"
              name="newpassword"
              type="email"
              icon={HiMail}
              placeholder="pelda@email.com"
              className="[&_input]:bg-gray-800/40 [&_input]:border-gray-700 [&_input]:text-white [&_input]:py-4 [&_input]:rounded-2xl focus:[&_input]:ring-blue-500"
              color={actionData?.errors?.newpassword ? "failure" : "gray"}
            />
            
            {/* Hibaüzenetek */}
            {actionData?.errors?.newpassword && (
              <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 tracking-tighter">
                {actionData.errors.newpassword}
              </p>
            )}
            {actionData?.errors?.serverError && (
              <p className="text-red-500 text-[10px] font-black uppercase italic ml-1 tracking-tighter flex items-center gap-1">
                <HiExclamationCircle className="h-4 w-4" /> {actionData.errors.serverError}
              </p>
            )}
          </div>

          {/* AKCIÓ GOMBOK */}
          <div className="flex flex-col gap-4 mt-2">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-14 bg-blue-600 enabled:hover:bg-blue-700 rounded-2xl font-black uppercase italic tracking-widest shadow-[0_15px_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 border-none"
            >
              {isSubmitting ? "Küldés..." : (
                <div className="flex items-center justify-center gap-2">
                  <HiPaperAirplane className="rotate-90 h-5 w-5" />
                  Link küldése
                </div>
              )}
            </Button>

            <Link to="/login" className="mx-auto inline-flex items-center text-gray-500 hover:text-white transition-colors uppercase font-black italic text-sm tracking-widest">
              <HiArrowLeft className="mr-2 h-4 w-4" />
              Vissza a belépéshez
            </Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}