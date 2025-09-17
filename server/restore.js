// restore.js
import pkg from "pg";
import fs from "fs";
import path from "path";
const { Pool } = pkg;

// Conexión a Neon usando URL completa
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_AkvEh6sVcf2x@ep-shiny-bird-ad9rmjap-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// Carpeta donde están los backups
const backupDir = path.join(process.cwd(), "backups");

// Función para restaurar backup
async function restaurarBackup(backupFile) {
  try {
    console.log("Restaurando backup desde:", backupFile);

    const rawData = fs.readFileSync(backupFile);
    const backupData = JSON.parse(rawData);

    await pool.query("BEGIN");

    // Restaurar tablas en el mismo orden de dependencia
    if (backupData.guerra) {
      await pool.query("TRUNCATE TABLE guerra RESTART IDENTITY CASCADE");
      for (const fila of backupData.guerra) {
        await pool.query(
          "INSERT INTO guerra (idusuario, puntuacion, fecha) VALUES ($1, $2, $3)",
          [fila.idusuario, fila.puntuacion, fila.fecha]
        );
      }
    }

    if (backupData.guerramultijugador) {
      await pool.query("TRUNCATE TABLE guerramultijugador RESTART IDENTITY CASCADE");
      for (const fila of backupData.guerramultijugador) {
        await pool.query(
          "INSERT INTO guerramultijugador (idusuario, idsocio, puntuacion, fecha) VALUES ($1, $2, $3, $4)",
          [fila.idusuario, fila.idsocio, fila.puntuacion, fila.fecha]
        );
      }
    }

    if (backupData.space) {
      await pool.query("TRUNCATE TABLE space RESTART IDENTITY CASCADE");
      for (const fila of backupData.space) {
        await pool.query(
          "INSERT INTO space (idusuario, puntuacion, fecha) VALUES ($1, $2, $3)",
          [fila.idusuario, fila.puntuacion, fila.fecha]
        );
      }
    }

    await pool.query("COMMIT");
    console.log("Restauración completada con éxito.");
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error("Error restaurando backup:", err);
  } finally {
    await pool.end();
  }
}

// Seleccionar el backup más reciente automáticamente
function obtenerBackupReciente() {
  if (!fs.existsSync(backupDir)) {
    console.error("No existe la carpeta de backups:", backupDir);
    process.exit(1);
  }
  const files = fs.readdirSync(backupDir)
    .filter(f => f.endsWith(".json"))
    .map(f => ({ file: f, mtime: fs.statSync(path.join(backupDir, f)).mtime }))
    .sort((a, b) => b.mtime - a.mtime);
  
  return files.length ? path.join(backupDir, files[0].file) : null;
}

// Ejecutar restore del backup más reciente
(async () => {
  const backupFile = obtenerBackupReciente();
  if (!backupFile) {
    console.error("No se encontró ningún backup para restaurar.");
    process.exit(1);
  }
  await restaurarBackup(backupFile);
})();
