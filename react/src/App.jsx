import Formulario from "./components/Formulario.jsx";
import Space from './spaceInvaders/spaceInvaders'
import Fondo from "./components/fondo.jsx";
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (  
   
      <div className=" min-h-screen grid place-items-center fondovi">
      <Fondo />
      <div > 
        <Routes > 
          <Route path="/" element={<Formulario />}/>
          <Route path="/space" element={<Space />}/>
        </Routes>
      </div>
    </div> 
  );
}

export default App;