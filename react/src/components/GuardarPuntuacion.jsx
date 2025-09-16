import { useState } from "react";

export default function GuardarPuntuacion({ idUsuario, juego }) {
  const [puntuacion, setPuntuacion] = useState("");
  const [mensaje, setMensaje] = useState("");

  const guardar = async () => {
    if (!puntuacion) {
      setMensaje("Ingresa una puntuación válida");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/${juego}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idusuario: idUsuario,
          puntuacion: parseInt(puntuacion, 10),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMensaje(data.error);
      } else {
        setMensaje("✅ Puntuación guardada!");
        setPuntuacion("");
      }
    } catch (err) {
      setMensaje("❌ Error al guardar puntuación");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow mt-4">
      <h3 className="font-bold text-lg mb-2 text-white">Guardar Puntuación</h3>
      <input
        type="number"
        value={puntuacion}
        onChange={(e) => setPuntuacion(e.target.value)}
        placeholder="Puntuación"
        className="w-full px-3 py-2 rounded bg-gray-900 text-white mb-2"
      />
      <button
        onClick={guardar}
        className="w-full py-2 bg-blue-600 rounded font-bold hover:bg-blue-700"
      >
        Guardar
      </button>
      {mensaje && <p className="mt-2 text-sm text-yellow-400">{mensaje}</p>}
    </div>
  );
}
