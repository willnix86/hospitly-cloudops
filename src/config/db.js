// src/config/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

// Master DB Connection
const masterDb = mysql.createPool({
    host: process.env.MASTER_DB_HOST,
    user: process.env.MASTER_DB_USER,
    password: process.env.MASTER_DB_PASSWORD,
    database: process.env.MASTER_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Function to connect to Tenant Database dynamically
const getTenantDb = async (tenantDbName) => {
    return mysql.createPool({
        host: process.env.TENANT_DB_HOST,  // Or dynamic host from DB record
        user: process.env.TENANT_DB_USER,
        password: process.env.TENANT_DB_PASSWORD,
        database: tenantDbName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};

module.exports = { masterDb, getTenantDb };