import Formulario from "./components/Formulario.jsx";
import Fondo from "./components/fondo.jsx";
import './App.css'

function App() {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Fondo */}
      <Fondo />

      {/* Modal centrado */}
      <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 rounded-3xl shadow-2xl border border-gray-700">
        <Formulario />
      </div>
    </div>
  );
}

export default App;
