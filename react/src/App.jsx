import Formulario from "./components/Formulario.jsx";
import Space from "./components/juegos/spaceInvaders/spaceInvaders.jsx";
import Guerra from "./components/juegos/1942/1942.jsx";
import Fondo from "./components/Fondo.jsx";
import Header from "./components/arriba.jsx";
import PantallaJuegos from "./components/PantallaJuegos.jsx";
import { Routes, Route, Link } from 'react-router-dom'
import './App.css';

function App() {
  return (  
      <div className=" min-h-screen grid place-items-center fondovi">
      <Header jugador1="nine" jugador2="mafu" />
      <Fondo />
      <div > 
        <Routes > 
          <Route />
          <Route path="/" element={<Formulario />}/>
          <Route path="/space" element={<Space />}/>
          <Route path="/guerra" element={<Guerra />}/>
          <Route path="/pantallajuegos" element={<PantallaJuegos />} />
        </Routes>
      </div>
    </div> 
  );
}

export default App;