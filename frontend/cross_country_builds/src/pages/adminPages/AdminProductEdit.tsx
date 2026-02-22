import { useLoaderData } from "react-router-dom";
import { EditForm } from "../../components/adminComponents/Admin_EditForm";

export function EditProductPage(){
    const data = useLoaderData();
    return(
        <>
            <EditForm product={data}/>
        </>
    );
}