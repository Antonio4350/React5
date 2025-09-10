import Formulario from "./components/Formulario.jsx";
import Space from './spaceInvaders/spaceInvaders'
import Fondo from "./components/fondo.jsx";
import { Routes, Route, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center">
        <Fondo />
        <div>
          <Routes>
            <Route path="/" element={<Formulario />}/>
            <Route path="/space" element={<Space />}/>
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
