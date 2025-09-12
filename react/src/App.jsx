import Formulario from "./components/Formulario.jsx";
import Space from "./components/juegos/spaceInvaders/spaceInvaders.jsx";
import Guerra from "./components/juegos/1942/1942.jsx";
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
          <Route path="/1942" element={<Guerra />}/>
        </Routes>
      </div>
    </div> 
  );
}

export default App;