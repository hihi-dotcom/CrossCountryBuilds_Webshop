import { Label, TextInput, Select, Button, Card } from "flowbite-react";
import { Form, useSearchParams } from "react-router-dom";
import { HiSearch, HiTag } from "react-icons/hi";
import { useState } from "react";

export function Szurok({ onSearch }: { onSearch: (filters: any) => void }) {
  const [searchParams] = useSearchParams();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const termekKategoriak = [
    { value: "kerékpárok", name: "Kerékpárok" },
    { value: "kiegészítők", name: "Kiegészítők" },
    { value: "Eszközök", name: "Eszközök" },
    { value: "ruházat", name: "Ruházat" }
  ];

  return (
    <Card className="border-none shadow-lg bg-white p-1 md:bg-white/95 md:backdrop-blur-sm">
      <Form method="get" className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">

        <div className="flex-1">
          <Label className="text-[11px] font-bold uppercase text-gray-500 mb-1 ml-1">Termék neve</Label>
          <TextInput
            id="name"
            name="name"
            icon={HiSearch}
            placeholder="Keresés..."

            className="[&_input]:bg-white [&_input]:text-gray-900 [&_input]:border-gray-200 focus:[&_input]:ring-blue-500" 
            defaultValue={searchParams.get("name") || ""}
          />
        </div>


        <div className="flex-1">
          <Label className="text-[11px] font-bold uppercase text-gray-500 mb-1 ml-1">Gyártó</Label>
          <TextInput
            id="maker"
            name="maker"
            icon={HiTag}
            placeholder="Márka"
            className="[&_input]:bg-white [&_input]:text-gray-900 [&_input]:border-gray-200 focus:[&_input]:ring-blue-500"
            defaultValue={searchParams.get("maker") || ""}
          />
        </div>


        <div className="flex-1">
          <Label className="text-[11px] font-bold uppercase text-gray-500 mb-1 ml-1">Kategória</Label>
          <Select 
            id="category" 
            name="category" 
            className="[&_select]:bg-white [&_select]:text-gray-900 [&_select]:border-gray-200 focus:[&_select]:ring-blue-500"
            defaultValue={searchParams.get("category") || ""}
          >
            <option value="">Összes kategória</option>
            {termekKategoriak.map((kat) => (
              <option key={kat.value} value={kat.value}>{kat.name}</option>
            ))}
          </Select>
        </div>

        
        <div className="flex-1">
          <Label className="text-[11px] font-bold uppercase text-gray-500 mb-1 ml-1">Árkeret (Ft)</Label>
          <div className="flex gap-2">
            <TextInput 
              name="priceFrom" 
              type="number" 
              placeholder="Min" 
              className="w-full [&_input]:bg-white [&_input]:text-gray-900" 
              defaultValue={searchParams.get("priceFrom") || ""}
            />
            <TextInput 
              name="priceTo" 
              type="number" 
              placeholder="Max" 
              className="w-full [&_input]:bg-white [&_input]:text-gray-900" 
              defaultValue={searchParams.get("priceTo") || ""}
            />
          </div>
        </div>

      
        <Button
          type="submit"
          color="blue"
          size="lg"
          className="font-bold uppercase tracking-widest mt-2 lg:mt-0 italic shadow-md active:scale-95 transition-transform"
        >
          <HiSearch className="mr-2 h-5 w-5" />
          Keresés
        </Button>
      </Form>
    </Card>
  );
}