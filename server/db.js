import mysql from 'mysql2/promise';

// Configura la conexión
const pool = mysql.createPool({
    host: 'localhost',      // Cambia según tu configuración
    user: 'root',           // Usuario de tu base de datos
    password: '',           // Contraseña del usuario
    database: 'padel' // Nombre de la base de datos
});

export default pool;
