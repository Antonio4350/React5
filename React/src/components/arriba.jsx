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

    // Configurar intervalo cada 5 segundos (5000 ms)
    const interval = setInterval(fetchJugadores, 5000);

    // Limpiar el intervalo al desmontar
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex justify-between items-center fixed top-0 left-0 w-full bg-black text-white p-4 shadow-md z-50">
      <div className="flex items-center gap-2">
        <span className="text-green-400">Jugador 1:</span>
        <span>{jugador1 || "Desconocido"}</span>
      </div>

      <div className="flex items-center gap-4">
        <a href="/" className="hover:text-red-500 transition">Inicio de Sesion</a>
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
