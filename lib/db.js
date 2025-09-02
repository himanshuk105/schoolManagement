import mysql from "mysql2/promise";

const connection = mysql.createPool({
  host: process.env.DB_HOST, // 127.0.0.1
  port: process.env.DB_PORT, // 3306
  user: process.env.DB_USER, // root
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, // school_management
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true, // require valid cert
  },
});

export default connection;
