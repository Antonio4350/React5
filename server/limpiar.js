// limpiar.js
import pkg from "pg";
import fs from "fs";
import path from "path";
const { Pool } = pkg;

// Conexión a Neon usando URL completa
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_AkvEh6sVcf2x@ep-shiny-bird-ad9rmjap-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// Carpeta para backups
const backupDir = path.join(process.cwd(), "backups");

// Función para crear backup
async function crearBackup() {
  try {
    console.log("Creando backup de tablas...");

    const tablas = ["guerra", "guerramultijugador", "space"];
    const backupData = {};

    for (const tabla of tablas) {
      const res = await pool.query(`SELECT * FROM ${tabla}`);
      backupData[tabla] = res.rows;
    }

    // Crear carpeta si no existe
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const fecha = new Date().toISOString().replace(/[:.]/g, "-");
    const backupFile = path.join(backupDir, `backup-${fecha}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log("Backup creado en:", backupFile);
  } catch (err) {
    console.error("Error creando backup:", err);
  }
}

// Función para limpiar tablas
async function limpiarTablas() {
  try {
    console.log("Limpiando tablas...");
    await pool.query("BEGIN");
    await pool.query("TRUNCATE TABLE guerramultijugador RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE guerra RESTART IDENTITY CASCADE");
    await pool.query("TRUNCATE TABLE space RESTART IDENTITY CASCADE");
    await pool.query("COMMIT");
    console.log("Tablas limpiadas correctamente.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error limpiando tablas:", err);
  } finally {
    await pool.end();
  }
}

// Ejecutar todo
(async () => {
  await crearBackup();
  await limpiarTablas();
})();
