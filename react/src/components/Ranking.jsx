import { useEffect, useState } from "react";

export default function Ranking({ idUsuario }) {
  const [mejoresSpace, setMejoresSpace] = useState([]);
  const [mejoresGuerra, setMejoresGuerra] = useState([]);
  const [usuarioSpace, setUsuarioSpace] = useState([]);
  const [usuarioGuerra, setUsuarioGuerra] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/space/top")
      .then((res) => res.json())
      .then(setMejoresSpace)
      .catch(() => setMejoresSpace([]));

    fetch("http://localhost:3001/guerra/top")
      .then((res) => res.json())
      .then(setMejoresGuerra)
      .catch(() => setMejoresGuerra([]));

    if (idUsuario) {
      fetch(`http://localhost:3001/space/user/${idUsuario}`)
        .then((res) => res.json())
        .then(setUsuarioSpace)
        .catch(() => setUsuarioSpace(null));

      fetch(`http://localhost:3001/guerra/user/${idUsuario}`)
        .then((res) => res.json())
        .then(setUsuarioGuerra)
        .catch(() => setUsuarioGuerra(null));
    }
  }, [idUsuario]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Space */}
      <div className="bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="text-xl font-bold mb-3 text-center">Top 10 Space</h2>
        <ul className="space-y-2">
          {mejoresSpace.map((fila, i) => (
            <li key={i} className="flex justify-between">
              <span>{i + 1}. {fila.nombre}</span>
              <span>{fila.puntuacion}</span>
            </li>
          ))}
        </ul>
        {idUsuario && (
          <div className="mt-4 text-center text-sm text-yellow-400">
            {usuarioSpace && usuarioSpace.length > 0
              ? `Tu última puntuación: ${usuarioSpace[0].puntuacion}`
              : "Tu puntuación: null"}
          </div>
        )}
      </div>

      {/* Top Guerra */}
      <div className="bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="text-xl font-bold mb-3 text-center">Top 10 Guerra (1942)</h2>
        <ul className="space-y-2">
          {mejoresGuerra.map((fila, i) => (
            <li key={i} className="flex justify-between">
              <span>{i + 1}. {fila.nombre}</span>
              <span>{fila.puntuacion}</span>
            </li>
          ))}
        </ul>
        {idUsuario && (
          <div className="mt-4 text-center text-sm text-yellow-400">
            {usuarioGuerra && usuarioGuerra.length > 0
              ? `Tu última puntuación: ${usuarioGuerra[0].puntuacion}`
              : "Tu puntuación: null"}
          </div>
        )}
      </div>

      {/* Puntuaciones Space Usuario */}
      <div className="bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="text-xl font-bold mb-3 text-center">Tus puntuaciones Space</h2>
        <ul className="space-y-2">
          {usuarioSpace && usuarioSpace.length > 0 ? (
            usuarioSpace.map((fila, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{new Date(fila.fecha).toLocaleDateString()}</span>
                <span>{fila.puntuacion}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-400">No hay puntuaciones</p>
          )}
        </ul>
      </div>

      {/* Puntuaciones Guerra Usuario */}
      <div className="bg-gray-800 rounded-xl p-4 shadow">
        <h2 className="text-xl font-bold mb-3 text-center">Tus puntuaciones Guerra</h2>
        <ul className="space-y-2">
          {usuarioGuerra && usuarioGuerra.length > 0 ? (
            usuarioGuerra.map((fila, i) => (
              <li key={i} className="flex justify-between text-sm">
                <span>{new Date(fila.fecha).toLocaleDateString()}</span>
                <span>{fila.puntuacion}</span>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-400">No hay puntuaciones</p>
          )}
        </ul>
      </div>
    </div>
  );
}
