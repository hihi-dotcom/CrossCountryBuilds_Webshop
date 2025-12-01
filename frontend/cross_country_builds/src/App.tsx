import './App.css'
import { Home } from './pages/HomePage'
import { Footer } from "./components/layout/footer/footerComponent";
function App() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Home/>
      <Footer/>
    </div>
  )
}

export default App
