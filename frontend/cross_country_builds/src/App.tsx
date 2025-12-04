import './App.css'
import AppRouter from './router/approuter';
import { Footer } from "./components/layout/footer/footerComponent";
import Navbar from './components/layout/navbar/navbarComponent';
function App() {
  return (
            
    <div className='min-h-screen flex flex-col bg-[#052636]'>
      
      <AppRouter/>
      
    </div>
  )
}

export default App
