import ProductModule from "../components/moduleComponents/productPageModule";

export default function ProductPage(){
    return(
        <>
            <main className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">

                    <div className="container mx-auto max-w-6xl">
                         <ProductModule/>
                    </div>
               
            </main>
        </>
    );
}