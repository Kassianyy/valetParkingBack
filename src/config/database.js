import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// La conexion usamos el partron Singleton
class Database {
  constructor() {
    if (!Database.instance) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'valetdb',
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      Database.instance = this;
    }

    return Database.instance;
  }

  getPool() {
    return this.pool;
  }
}

const databaseInstance = new Database();
export default databaseInstance.getPool();
