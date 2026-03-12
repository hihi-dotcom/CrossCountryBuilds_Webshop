import { Button, TextInput, Alert } from "flowbite-react";
import { Form, useActionData } from "react-router-dom";

export function EditAppointmentForm({ appointment }: any) {
  const actionData = useActionData();
  return (
    <>
      <div className="flex min-h-screen items-center justify-center p-4">
        <Form
          method="patch"
          className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <h2 className="text-2xl font-bold text-center dark:text-white mb-2">
            Szervizidőpont módosítása
          </h2>

          <div className="w-full">
            <TextInput
              id="customer_name"
              name="customer_name"
              type="text"
              placeholder="pl.: Kovács Géza"
              shadow
              className="w-full"
              defaultValue={appointment ? appointment.customer_name : ""}
              disabled
            />
          </div>

          <div className="w-full">
            <TextInput
              id="service_date"
              type="datetime-local"
              name="service_date"
              placeholder="2026..."
              shadow
              className="w-full"
              defaultValue={
                appointment?.service_date
                  ? new Date(appointment.service_date)
                      .toISOString()
                      .substring(0, 16)
                  : ""
              }
              disabled
            />
          </div>

          <div className="w-full">
            <TextInput
              id="problem_description"
              type="text"
              name="problem_description"
              placeholder="Durr defektet kaptam a Balaton körön"
              shadow
              className="w-full"
              defaultValue={appointment ? appointment.problem_description : ""}
              disabled
            />
          </div>
          <div className="w-full">
            <TextInput
              id="service_price"
              type="number"
              name="service_price"
              shadow
              className="w-full"
              placeholder="pl: 150 000"
              defaultValue={appointment ? appointment.service_price : 0}
              min={0}
              max={100000000}
            />
            {actionData?.errors?.service_price && (
              <span className="text-red-500 text-xs font-bold italic ml-1 uppercase">
                {actionData.errors.service_price[0]}
              </span>
            )}
          </div>
          <div className="w-full">
            <TextInput
              id="bringback_date"
              type="datetime-local"
              name="bringback_date"
              shadow
              className="w-full"
              placeholder="pl: 50"
              defaultValue={
                appointment.bringback_date
                  ? appointment.bringback_date.substring(0, 16)
                  : ""
              }
            />
            {actionData?.errors?.bringback_date && (
              <span className="text-red-500 text-xs font-bold italic ml-1 uppercase">
                {actionData.errors.bringback_date[0]}
              </span>
            )}
          </div>

          {actionData?.message && (
            <>
              <Alert color="failure" className="mb-2">
                <span className="font-medium">Hiba történt:</span>{" "}
                {actionData.message}
              </Alert>
            </>
          )}

          <Button type="submit" className="w-full">
            Mentés
          </Button>
        </Form>
      </div>
    </>
  );
}
