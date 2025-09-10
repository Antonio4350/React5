import Formulario from "./components/Formulario.jsx";
import Background from "./components/fondo.jsx";

function App() {
  return (
    <div className="relative w-screen h-screen">
      {/* Fondo dinámico */}
      <Background />

      {/* Contenedor centrado */}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-black/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-11/12 max-w-md">
          <Formulario 
            subirDatos={(usuario) => console.log("Usuario enviado:", usuario)} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
