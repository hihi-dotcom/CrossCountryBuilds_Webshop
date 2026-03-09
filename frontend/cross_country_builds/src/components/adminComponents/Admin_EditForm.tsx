import { Button, Label, TextInput, Alert } from "flowbite-react";
import { Form, useActionData } from "react-router-dom";

export function EditForm({product}:any) {
  const actionData = useActionData();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      
      
      <Form method="PATCH" className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800">
        
        <h2 className="text-2xl font-bold text-center dark:text-white mb-2">{product ? product.name : "Termék"} módosítása</h2>

        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="name">Módosítsd a termék nevét!</Label>
          </div>
          <TextInput id="name" name="name" type="text" placeholder="Specialized..."   shadow className="w-full" defaultValue={product ? product.name : ''} />
        </div>

        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="category">Módosítsd a termék kategóriát!</Label>
          </div>
          <TextInput id="category" type="text" name="category" placeholder="kerékpárok..."   shadow className="w-full" defaultValue={product ? product.category : ''}/>
        </div>

        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="maker">Módosítsd a termék gyártóját!</Label>
          </div>
          <TextInput id="maker" type="text" name="maker" placeholder="pl. KTM"   shadow className="w-full" defaultValue={product ? product.maker : ''}/>
        </div>
        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="price">Adj meg egy új árat a terméknek!</Label>
          </div>
          <TextInput id="price" type="number" name="price"   shadow className="w-full" placeholder="pl: 150 000" defaultValue={product ? product.price : ''} min={0} max={100000000} />
        </div>
        <div className="w-full">
          <div className="mb-2 block">
            <Label htmlFor="stock_number">Mennyi van ebből a termékből?</Label>
          </div>
          <TextInput id="stock_number" type="number" name="stock_number"   shadow className="w-full" placeholder="pl: 50"  defaultValue={product ? product.stock_number : ''} min={0} max={150}/>
        </div>

          {actionData?.message && (
            <>
              <Alert color="failure" className="mb-2">
                <span className="font-medium">Hiba történt:</span> {actionData.message}
              </Alert>
            </>
          )}

        <Button type="submit" className="w-full">
            Mentés
        </Button>
      </Form>
    </div>
  );
}