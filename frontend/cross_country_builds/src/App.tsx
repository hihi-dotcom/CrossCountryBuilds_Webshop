import './App.css'
import { Home } from './pages/HomePage'
import { Footer } from "./components/layout/footer/footerComponent";
function App() {
  return (
            
    <div className='min-h-screen flex flex-col bg-[#052636]'>
      <Home/>
      <Footer/>
    </div>
  )
}

export default App
