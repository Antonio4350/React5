import { useEffect, useState } from "react";
import CONFIG from "../config";

export default function Ranking({ idUsuario }) {
  const [mejoresSpace, setMejoresSpace] = useState([]);
  const [mejoresGuerra, setMejoresGuerra] = useState([]);
  const [mejoresMulti, setMejoresMulti] = useState([]);
  const [usuarioSpace, setUsuarioSpace] = useState(null);
  const [usuarioGuerra, setUsuarioGuerra] = useState(null);
  const [usuarioMulti, setUsuarioMulti] = useState(null);

  useEffect(() => {
    // Función para obtener top
    async function fetchTop(url, setState) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setState(data);
      } catch {
        setState([]);
      }
    }

    // ahora cada endpoint ya devuelve los nombres correctos
    fetchTop(`${CONFIG.API_URL}/space/top`, setMejoresSpace);
    fetchTop(`${CONFIG.API_URL}/guerra/top`, setMejoresGuerra);
    fetchTop(`${CONFIG.API_URL}/guerramultijugador/top`, setMejoresMulti);

    if (idUsuario) {
      // Solo guardar la puntuación del usuario actual
      fetch(`${CONFIG.API_URL}/space/user/${idUsuario}`)
        .then((res) => res.json())
        .then((data) => setUsuarioSpace(data?.length > 0 ? data[0] : null))
        .catch(() => setUsuarioSpace(null));

      fetch(`${CONFIG.API_URL}/guerra/user/${idUsuario}`)
        .then((res) => res.json())
        .then((data) => setUsuarioGuerra(data?.length > 0 ? data[0] : null))
        .catch(() => setUsuarioGuerra(null));

      fetch(`${CONFIG.API_URL}/guerramultijugador/user/${idUsuario}`)
        .then((res) => res.json())
        .then((data) => setUsuarioMulti(data?.length > 0 ? data[0] : null))
        .catch(() => setUsuarioMulti(null));
    }
  }, [idUsuario]);

  return (
    <div className="min-h-screen text-white pt-28 px-6 pb-12 z-40 relative">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Top Space */}
        <div className="bg-black/80 border-4 border-white p-4 shadow-lg retro-text">
          <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Space</h2>
          <ul className="space-y-2">
            {mejoresSpace.map((fila, i) => (
              <li key={i} className="flex justify-between text-lg">
                <span>{i + 1}. {fila.nombre}</span>
                <span>{fila.puntuacion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Guerra 1942 */}
        <div className="bg-black/80 border-4 border-white p-4 shadow-lg retro-text">
          <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Guerra (1942)</h2>
          <ul className="space-y-2">
            {mejoresGuerra.map((fila, i) => (
              <li key={i} className="flex justify-between text-lg">
                <span>{i + 1}. {fila.nombre}</span>
                <span>{fila.puntuacion}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Multijugador */}
        <div className="bg-black/80 border-4 border-white p-4 shadow-lg retro-text">
          <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Multijugador</h2>
          <ul className="space-y-2">
            {mejoresMulti.map((fila, i) => (
              <li key={i} className="flex justify-between text-lg">
                <span>{i + 1}. {fila.jugador1} y {fila.jugador2}</span>
                <span>{fila.puntuacion}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
