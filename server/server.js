import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // tu contraseña de XAMPP
  database: "react5",
});

// Crear usuario
app.post("/usuarios", async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const [exists] = await db.query("SELECT id FROM usuarios WHERE nombre = ?", [nombre]);
    if (exists.length > 0) return res.status(409).json({ error: "Usuario ya existe" });

    const [result] = await db.query("INSERT INTO usuarios (nombre, password) VALUES (?, ?)", [nombre, password]);
    res.json({ id: result.insertId, nombre });
  } catch (err) {
    res.status(500).json({ error: "No se pudo comunicar con la base de datos" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { nombre, password } = req.body;
  if (!nombre || !password) return res.status(400).json({ error: "Faltan datos" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM usuarios WHERE nombre = ? AND password = ?",
      [nombre, password]
    );

    if (rows.length === 0) {
      // Usuario no encontrado
      return res.status(404).json({ error: "Usuario inexistente" });
    }

    // Usuario encontrado
    res.json({ id: rows[0].id, nombre: rows[0].nombre });
  } catch (err) {
    // Error de conexión o consulta
    res.status(500).json({ error: "No se pudo comunicar con la base de datos" });
  }
});

app.listen(3001, () => console.log("Servidor escuchando en http://localhost:3001"));
