
import OrderDataModule from "../components/moduleComponents/orderData";


export default function OrderDataPage(){

    return(
        <>
            <section className="my-10">
                <h2 className="text-4xl text-center sm:text-start md:ml-30">A megrendelés adatai</h2>
                <OrderDataModule/>
            </section>
            
        </>
    );
}