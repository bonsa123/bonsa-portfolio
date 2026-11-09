import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

// Support both DATABASE_URL (Railway/Render/Aiven) and individual env vars
const dbConfig = process.env.DATABASE_URL
  ? {
      uri: process.env.DATABASE_URL,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'portfolio_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }

const pool = mysql.createPool(dbConfig)

export default pool
