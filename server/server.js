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

    res.json(result.rows[0]); // {id, nombre}
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

// Guardar puntuación Space
app.post("/space", async (req, res) => {
  const { idusuario, puntuacion } = req.body;
  if (!idusuario || puntuacion == null)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await pool.query(
      "INSERT INTO space (idusuario, puntuacion) VALUES ($1, $2) RETURNING *",
      [idusuario, puntuacion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando puntuación" });
  }
});

// Top 10 Space
app.get("/space/top", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.nombre, s.puntuacion
      FROM space s
      JOIN usuarios u ON u.id = s.idusuario
      ORDER BY s.puntuacion DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando top" });
  }
});

// Puntuaciones de un usuario en Space
app.get("/space/user/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT puntuacion, fecha FROM space WHERE idusuario = $1 ORDER BY fecha DESC",
      [req.params.id]
    );
    res.json(result.rows.length ? result.rows : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando puntuaciones" });
  }
});

// Guardar puntuación Guerra
app.post("/guerra", async (req, res) => {
  const { idusuario, puntuacion } = req.body;
  if (!idusuario || puntuacion == null)
    return res.status(400).json({ error: "Faltan datos" });

  try {
    const result = await pool.query(
      "INSERT INTO guerra (idusuario, puntuacion) VALUES ($1, $2) RETURNING *",
      [idusuario, puntuacion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando puntuación" });
  }
});

// Top 10 Guerra
app.get("/guerra/top", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.nombre, g.puntuacion
      FROM guerra g
      JOIN usuarios u ON u.id = g.idusuario
      ORDER BY g.puntuacion DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando top" });
  }
});

// Puntuaciones de un usuario en Guerra
app.get("/guerra/user/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT puntuacion, fecha FROM guerra WHERE idusuario = $1 ORDER BY fecha DESC",
      [req.params.id]
    );
    res.json(result.rows.length ? result.rows : null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando puntuaciones" });
  }
});

app.listen(3001, () =>
  console.log("Servidor escuchando en http://localhost:3001")
);
