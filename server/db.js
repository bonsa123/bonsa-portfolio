import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLURL

// Support DATABASE_URL / MYSQL_URL (Railway/Render/Aiven) and individual env vars
const dbConfig = connectionUri
  ? {
      uri: connectionUri,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  : {
      host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
      port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
      user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
      password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
      database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'portfolio_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

const pool = mysql.createPool(dbConfig)

export default pool
