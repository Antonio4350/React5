import pkg from 'pg';
const { Pool } = pkg;

// Configuración de la conexión a NeonDB
const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_AkvEh6sVcf2x@ep-shiny-bird-ad9rmjap-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

// Test de conexión
pool.connect()
    .then(client => {
        console.log('Conectado a la base de datos PostgreSQL!');
        client.release();
    })
    .catch(err => console.error('Error conectando a la base de datos:', err));

export default pool;