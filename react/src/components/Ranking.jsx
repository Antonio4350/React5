import { useEffect, useState } from "react";
import CONFIG from "../config";

export default function Ranking({ idUsuario }) {
  const [mejoresSpace, setMejoresSpace] = useState([]);
  const [mejoresGuerra, setMejoresGuerra] = useState([]);
  const [mejoresMulti, setMejoresMulti] = useState([]);
  const [usuarioSpace, setUsuarioSpace] = useState([]);
  const [usuarioGuerra, setUsuarioGuerra] = useState([]);
  const [usuarioMulti, setUsuarioMulti] = useState([]);

  useEffect(() => {
    fetch(`${CONFIG.API_URL}/space/top`)
      .then((res) => res.json())
      .then(setMejoresSpace)
      .catch(() => setMejoresSpace([]));

    fetch(`${CONFIG.API_URL}/guerra/top`)
      .then((res) => res.json())
      .then(setMejoresGuerra)
      .catch(() => setMejoresGuerra([]));

    fetch(`${CONFIG.API_URL}/guerramultijugador/top`)
      .then((res) => res.json())
      .then(setMejoresMulti)
      .catch(() => setMejoresMulti([]));

    if (idUsuario) {
      fetch(`${CONFIG.API_URL}/space/user/${idUsuario}`)
        .then((res) => res.json())
        .then(setUsuarioSpace)
        .catch(() => setUsuarioSpace(null));

      fetch(`${CONFIG.API_URL}/guerra/user/${idUsuario}`)
        .then((res) => res.json())
        .then(setUsuarioGuerra)
        .catch(() => setUsuarioGuerra(null));

      fetch(`${CONFIG.API_URL}/guerramultijugador/user/${idUsuario}`)
        .then((res) => res.json())
        .then(setUsuarioMulti)
        .catch(() => setUsuarioMulti(null));
    }
  }, [idUsuario]);
return (
  <div className="min-h-screen text-white pt-28 px-6 pb-12 z-40 relative">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Top Space */}
      <div className="bg-black/80 border-4 border-white  p-4 shadow-lg retro-text">
        <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Space</h2>
        <ul className="space-y-2">
          {mejoresSpace.map((fila, i) => (
            <li key={i} className="flex justify-between text-lg">
              <span>{i + 1}. {fila.nombre}</span>
              <span>{fila.puntuacion}</span>
            </li>
          ))}
        </ul>
        {idUsuario && (
          <div className="mt-4 text-center text-sm text-yellow-400">
            {usuarioSpace?.length > 0
              ? `Tu última puntuación: ${usuarioSpace[0].puntuacion}`
              : "Tu puntuación: null"}
          </div>
        )}
      </div>

      {/* Top Guerra 1942 */}
      <div className="bg-black/80 border-4 border-white  p-4 shadow-lg retro-text">
        <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Guerra (1942)</h2>
        <ul className="space-y-2">
          {mejoresGuerra.map((fila, i) => (
            <li key={i} className="flex justify-between text-lg">
              <span>{i + 1}. {fila.nombre}</span>
              <span>{fila.puntuacion}</span>
            </li>
          ))}
        </ul>
        {idUsuario && (
          <div className="mt-4 text-center text-sm text-yellow-400">
            {usuarioGuerra?.length > 0
              ? `Tu última puntuación: ${usuarioGuerra[0].puntuacion}`
              : "Tu puntuación: null"}
          </div>
        )}
      </div>

      {/* Top Multijugador */}
      <div className="bg-black/80 border-4 border-white  p-4 shadow-lg retro-text">
        <h2 className="text-2xl font-bold mb-4 text-center">Top 10 Multijugador</h2>
        <ul className="space-y-2">
          {mejoresMulti.map((fila, i) => (
            <li key={i} className="flex justify-between text-lg">
              <span>{i + 1}. {fila.jugador1} y {fila.jugador2}</span>
              <span>{fila.puntuacion}</span>
            </li>
          ))}
        </ul>
        {idUsuario && (
          <div className="mt-4 text-center text-sm text-yellow-400">
            {usuarioMulti?.length > 0
              ? `Tu última puntuación: ${usuarioMulti[0].puntuacion}`
              : "Tu puntuación: null"}
          </div>
        )}
      </div>
    </div>
  </div>
);

}
