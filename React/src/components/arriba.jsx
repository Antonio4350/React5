import { useEffect, useState } from "react";
import CONFIG from "../config";

const Arriba = () => {
  const [jugador1, setJugador1] = useState(null);
  const [jugador2, setJugador2] = useState(null);

  const fetchJugadores = () => {
    const id1 = localStorage.getItem("jugador1_id");
    const id2 = localStorage.getItem("jugador2_id");

    if (id1) {
      fetch(`${CONFIG.API_URL}/usuarios/${id1}`)
        .then((res) => res.json())
        .then((data) => setJugador1(data.nombre))
        .catch(() => setJugador1("Desconocido"));
    } else {
      setJugador1("Desconocido");
    }

    if (id2) {
      fetch(`${CONFIG.API_URL}/usuarios/${id2}`)
        .then((res) => res.json())
        .then((data) => setJugador2(data.nombre))
        .catch(() => setJugador2("Desconocido"));
    } else {
      setJugador2("Desconectado");
    }
  };

  useEffect(() => {
    // Ejecutar inmediatamente al montar
    fetchJugadores();

    const interval = setInterval(fetchJugadores, 1000);

    // Limpiar el intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  function cerrarSesion()
  {
    localStorage.removeItem('jugador1_id');
    localStorage.removeItem('jugador1_nombre');
    localStorage.removeItem('jugador2_id');
    localStorage.removeItem('jugador2_nombre');
    window.location.href = "/";
  }

  return (
    <header className="flex justify-between items-center fixed top-0 left-0 w-full bg-black text-white p-4 shadow-md z-100">
      <div className="flex items-center gap-2">
        <span className="text-green-400">Jugador 1:</span>
        <span>{jugador1 || "Desconocido"}</span>
      </div>

      <div className="flex items-center gap-4">
        <a className="hover:text-red-500 transition" onClick={cerrarSesion} style={{cursor: "pointer"}}>Cerrar sesion</a>
        <a href="/pantallajuegos" className="hover:text-gray-500 transition">Juegos</a>
        <a href="/ranking" className="hover:text-gray-500 transition">Ranking</a>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-purple-400">Jugador 2:</span>
        <span>{jugador2 || "Desconectado"}</span>
      </div>
    </header>
  );
};

export default Arriba;
