import BackToWebShopButton from "../components/buttonComponents/backtoWebshopButton";
import MyDataChangeModule from "../components/moduleComponents/myDataChange";


export default function MyDataPage(){
    return(
        <>
            <section className="mt-10">
                <h2 className="text-5xl text-start md:ml-30 m-5">Saját adataim</h2>
                <MyDataChangeModule/>
            </section>
         
        </>

    );
}