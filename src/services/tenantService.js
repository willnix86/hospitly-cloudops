// src/services/tenantService.js
const { createAccount, deleteAccount } = require('../models/accounts');
const { createTenantSchema, deleteTenantSchema } = require('../models/tenantSchema');
const mysql = require('mysql2/promise');

// Create a new tenant (Account + Database)
const createNewTenant = async (hospitalName, contactName, contactEmail) => {
    const dbName = `${hospitalName.toLowerCase().replace(/\s/g, '_')}_db`;
    const dbHost = process.env.TENANT_DB_HOST;

    // 1. Create the tenant account in the master database
    const accountId = await createAccount(hospitalName, contactName, contactEmail, dbName, dbHost);

    // 2. Create the tenant's specific database schema
    const connection = await mysql.createConnection({
        host: dbHost,
        user: process.env.TENANT_DB_USER,
        password: process.env.TENANT_DB_PASSWORD
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.end();

    // 3. Create the schema in the tenant's database
    await createTenantSchema(dbName);

    return accountId; // Return the new account ID
};

// Delete a tenant (Account + Database)
const deleteTenant = async (hospitalId, dbName) => {
    // 1. Delete the account from the master database
    await deleteAccount(hospitalId);

    // 2. Drop the tenant's database
    await deleteTenantSchema(dbName);
};

module.exports = { createNewTenant, deleteTenant };