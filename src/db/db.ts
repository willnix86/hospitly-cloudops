import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';

dotenv.config();

export const masterDb: Pool = mysql.createPool({
    host: process.env.MASTER_DB_HOST,
    user: process.env.MASTER_DB_USER,
    password: process.env.MASTER_DB_PASSWORD,
    database: process.env.MASTER_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const getTenantDb = async (hospitalName: string): Promise<Pool> => {
    const dbName = `${hospitalName.toLowerCase().replace(/\s/g, '_')}_tenant_db`;
    return mysql.createPool({
        host: process.env.MASTER_DB_HOST,
        user: process.env.TENANT_DB_USER,
        password: process.env.TENANT_DB_PASSWORD,
        database: dbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};