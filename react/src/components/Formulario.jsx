import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../config";

export default function Formulario() {
  const [modo, setModo] = useState(["login", "login"]); // cada jugador maneja su modo
  const [jugadores, setJugadores] = useState(1);
  const [form, setForm] = useState([
    { nombre: "", password: "", repetir: "", logueado: false },
    { nombre: "", password: "", repetir: "", logueado: false },
  ]);
  const [error, setError] = useState(["", ""]);
  const [mensaje, setMensaje] = useState(["", ""]);
  const navigate = useNavigate();

  const handleChange = (i, e) =>
    setForm((prev) =>
      prev.map((f, idx) =>
        idx === i ? { ...f, [e.target.name]: e.target.value } : f
      )
    );

  const handleSubmit = async (i, e) => {
    e.preventDefault();
    setError((prev) => prev.map((err, idx) => (idx === i ? "" : err)));
    setMensaje((prev) => prev.map((msg, idx) => (idx === i ? "" : msg)));

    const jugador = form[i];

    if (
      !jugador.nombre ||
      !jugador.password ||
      (modo[i] === "crear" && !jugador.repetir)
    ) {
      setError((prev) =>
        prev.map((err, idx) =>
          idx === i ? "Todos los campos son obligatorios" : err
        )
      );
      return;
    }

    if (modo[i] === "crear" && jugador.password !== jugador.repetir) {
      setError((prev) =>
        prev.map((err, idx) =>
          idx === i ? "Las contraseñas no coinciden" : err
        )
      );
      return;
    }

    try {
      const url =
        modo[i] === "login"
          ? `${CONFIG.API_URL}/login`
          : `${CONFIG.API_URL}/usuarios`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: jugador.nombre,
          password: jugador.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError((prev) =>
          prev.map((err, idx) => (idx === i ? data.error : err))
        );
      } else {
        if (modo[i] === "login") {
          setForm((prev) =>
            prev.map((f, idx) =>
              idx === i ? { ...f, logueado: true } : f
            )
          );

          // Guardar id y nombre en localStorage según jugador
          localStorage.setItem(`jugador${i + 1}_id`, data.id);
          localStorage.setItem(`jugador${i + 1}_nombre`, data.nombre);

          // si hay un jugador, pasa directo
          if (jugadores === 1) {
            localStorage.removeItem('jugador2_id');
            localStorage.removeItem('jugador2_nombre');
            navigate("/pantallajuegos");
          }
          // si son dos, espera al otro
          else if (form[1 - i].logueado) {
            navigate("/pantallajuegos");
          } else {
            setMensaje((prev) =>
              prev.map((msg, idx) =>
                idx === i
                  ? "Esperando que el otro jugador se loguee..."
                  : msg
              )
            );
          }
        } else {
          setMensaje((prev) =>
            prev.map((msg, idx) =>
              idx === i ? `Usuario ${data.nombre} creado` : msg
            )
          );
          setForm((prev) =>
            prev.map((f, idx) =>
              idx === i ? { nombre: "", password: "", repetir: "" } : f
            )
          );
        }
      }
    } catch {
      setError((prev) =>
        prev.map((err, idx) =>
          idx === i ? "No se pudo comunicar con la base de datos" : err
        )
      );
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{paddingTop:"50px"}}>
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={() => setJugadores(1)}
          className={`px-6 py-3 font-bold border-2 border-white rounded-xl retro-text transition-all duration-300 ${
            jugadores === 1 ? "bg-white text-black" : "bg-black text-white"
          } hover:bg-white hover:text-black`}
        >
          1 Jugador
        </button>
        <button
          onClick={() => setJugadores(2)}
          className={`px-6 py-3 font-bold border-2 border-white rounded-xl retro-text transition-all duration-300 ${
            jugadores === 2 ? "bg-white text-black" : "bg-black text-white"
          } hover:bg-white hover:text-black`}
        >
          2 Jugadores
        </button>
      </div>

      <div
        className={`flex ${jugadores === 2 ? "flex-row gap-10" : "flex-col"} items-center justify-center`}
      >
        {[...Array(jugadores)].map((_, i) => (
          <div
            key={i}
            className="bg-black/90 border-4 border-white p-6 text-center shadow-lg animate-scaleIn max-w-md w-full rounded-xl"
          >
            <h2 className="text-3xl font-bold text-white mb-4 tracking-widest neon-text-for">
              {modo[i] === "login"
                ? `LOGIN JUGADOR ${i + 1}`
                : `CREAR JUGADOR ${i + 1}`}
            </h2>

            <form
              onSubmit={(e) => handleSubmit(i, e)}
              className="w-full flex flex-col space-y-4 bg-black/80 p-4 rounded-xl border-2 border-white"
            >
              {error[i] && (
                <p className="text-red-500 font-bold text-center">{error[i]}</p>
              )}
              {mensaje[i] && (
                <p className="text-green-400 font-bold text-center">
                  {mensaje[i]}
                </p>
              )}

              <div className="flex flex-col">
                <label className="text-white font-semibold mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form[i].nombre}
                  onChange={(e) => handleChange(i, e)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-white font-semibold mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  value={form[i].password}
                  onChange={(e) => handleChange(i, e)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
                  required
                />
              </div>

              {modo[i] === "crear" && (
                <div className="flex flex-col">
                  <label className="text-white font-semibold mb-1">
                    Repetir contraseña
                  </label>
                  <input
                    type="password"
                    name="repetir"
                    value={form[i].repetir}
                    onChange={(e) => handleChange(i, e)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-black text-white font-bold border-2 border-white hover:bg-white hover:text-black transition"
              >
                {modo[i] === "login" ? "LOGIN" : "CREAR"}
              </button>
            </form>

            <button
              onClick={() => {
                setModo((prev) =>
                  prev.map((m, idx) =>
                    idx === i ? (m === "login" ? "crear" : "login") : m
                  )
                );
                setError((prev) => prev.map((err, idx) => (idx === i ? "" : err)));
                setMensaje((prev) =>
                  prev.map((msg, idx) => (idx === i ? "" : msg))
                );
                setForm((prev) =>
                  prev.map((f, idx) =>
                    idx === i
                      ? { nombre: "", password: "", repetir: "", logueado: false }
                      : f
                  )
                );
              }}
              className="mt-4 text-white font-bold hover:underline transition"
            >
              {modo[i] === "login"
                ? "Crear un nuevo usuario"
                : "Volver al login"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
