import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CartProvider} from  "./components/custom_hooks/CartContext";
import routes from './router/Routes';
function App() {

   const router = createBrowserRouter(routes);
  return (
            
    <div className='min-h-screen flex flex-col bg-[#052636]'>
      
        <CartProvider>
            <RouterProvider router={router}/>
        </CartProvider>
      
    </div>
  )
}

export default App
