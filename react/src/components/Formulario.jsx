import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CONFIG from "../config";

export default function Formulario() {
  const [modo, setModo] = useState("login");
  const [form, setForm] = useState({ nombre: "", password: "", repetir: "" });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (!form.nombre || !form.password || (modo === "crear" && !form.repetir)) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (modo === "crear" && form.password !== form.repetir) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const url =
        modo === "login"
          ? `${CONFIG.API_URL}/login`
          : `${CONFIG.API_URL}/usuarios`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: form.nombre, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        if (modo === "login") {
          navigate("/pantallajuegos");
        } else {
          setMensaje(`Usuario ${data.nombre} creado`);
          setForm({ nombre: "", password: "", repetir: "" });
        }
      }
    } catch (err) {
      setError("No se pudo comunicar con la base de datos");
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="bg-black/90 border-4 border-white p-8 text-center shadow-lg animate-scaleIn max-w-md w-full">
        <h2 className="text-4xl font-bold text-white mb-6 tracking-widest retro-text">
          {modo === "login" ? "LOGIN JUGADOR" : "CREAR USUARIO"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-5 bg-black/80 p-6 rounded-xl shadow-inner border-2 border-white"
        >
          {error && (
            <p className="text-red-500 font-bold text-center">{error}</p>
          )}
          {mensaje && (
            <p className="text-green-400 font-bold text-center">{mensaje}</p>
          )}

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white font-semibold mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
              required
            />
          </div>

          {modo === "crear" && (
            <div className="flex flex-col">
              <label className="text-white font-semibold mb-1">
                Repetir contraseña
              </label>
              <input
                type="password"
                name="repetir"
                placeholder="Repetir contraseña"
                value={form.repetir}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-black text-white font-bold border-2 border-white hover:bg-white hover:text-black transition"
          >
            {modo === "login" ? "LOGIN" : "CREAR"}
          </button>
        </form>

        <button
          onClick={() => {
            setModo(modo === "login" ? "crear" : "login");
            setError("");
            setMensaje("");
            setForm({ nombre: "", password: "", repetir: "" });
          }}
          className="mt-4 text-white font-bold hover:underline transition"
        >
          {modo === "login" ? "Crear un nuevo usuario" : "Volver al login"}
        </button>
      </div>
    </div>
  );
}
