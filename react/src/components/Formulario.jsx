import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Formulario() {
  const [modo, setModo] = useState("login"); // 'login' o 'crear'
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
          ? "http://localhost:3001/login"
          : "http://localhost:3001/usuarios";

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
          // ✅ Si el login es exitoso, redirige a PantallaJuegos
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
    <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 rounded-3xl shadow-2xl border border-gray-700">
      <div className="flex flex-col items-center w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          {modo === "login" ? "Login Jugador" : "Crear Usuario"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col space-y-5 bg-gray-800 p-6 rounded-2xl shadow-inner"
        >
          {error && (
            <p className="text-red-500 font-medium text-center">{error}</p>
          )}
          {mensaje && (
            <p className="text-green-400 font-medium text-center">{mensaje}</p>
          )}

          <div className="flex flex-col">
            <label className="text-gray-200 font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-200 font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Tu contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {modo === "crear" && (
            <div className="flex flex-col">
              <label className="text-gray-200 font-medium mb-1">
                Repetir contraseña
              </label>
              <input
                type="password"
                name="repetir"
                placeholder="Repetir contraseña"
                value={form.repetir}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 mt-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition"
          >
            {modo === "login" ? "Login" : "Crear Usuario"}
          </button>
        </form>

        <button
          onClick={() => {
            setModo(modo === "login" ? "crear" : "login");
            setError("");
            setMensaje("");
            setForm({ nombre: "", password: "", repetir: "" });
          }}
          className="mt-4 text-blue-400 hover:underline transition"
        >
          {modo === "login" ? "Crear un nuevo usuario" : "Volver al login"}
        </button>
      </div>
    </div>
  );
}
