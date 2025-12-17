import OrderDataModule from "../components/moduleComponents/orderData";


export default function OrderDataPage(){
    return(
        <>
            <main className="mt-10">
                <h2 className="text-3xl text-start md:ml-30">A megrendelés adatai</h2>
                <OrderDataModule/>
            </main>
            
        </>
    );
}