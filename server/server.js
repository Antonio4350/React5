import express from "express";
import cors from "cors";
import pool from "./conectdb.js"; // conexión a PostgreSQL

const app = express();
app.use(cors());
app.use(express.json());

// Crear usuario
app.post("/usuarios", async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const exists = await pool.query(
      "SELECT id FROM usuarios WHERE nombre = $1",
      [nombre]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({ error: "Usuario ya existe" });

    const result = await pool.query(
      "INSERT INTO usuarios (nombre, password) VALUES ($1, $2) RETURNING id, nombre",
      [nombre, password]
    );

    res.json(result.rows[0]); // devuelve {id, nombre}
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo comunicar con la base de datos" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE nombre = $1 AND password = $2",
      [nombre, password]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Usuario inexistente" });
    }

    res.json({ id: result.rows[0].id, nombre: result.rows[0].nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo comunicar con la base de datos" });
  }
});

// Iniciar servidor
app.listen(3001, () =>
  console.log("Servidor escuchando en http://localhost:3001")
);
