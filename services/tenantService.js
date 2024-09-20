// src/services/tenantService.js
const { createAccount, deleteAccount } = require('../models/accountSchema');
const { createTenantSchema, deleteTenantSchema } = require('../models/tenantSchema');
const mysql = require('mysql2/promise');

// Create a new tenant (Account + Database)
const createNewTenant = async (hospitalName, contactName, contactEmail, username, password) => {
    const dbName = `${hospitalName.toLowerCase().replace(/\s/g, '_')}_tenant_db`;
    const dbHost = process.env.MASTER_DB_HOST;

    let accountId;

    try {
        // 1. Create the tenant account in the master database
        accountId = await createAccount(hospitalName, contactName, contactEmail, dbName, username, password);

        // 2. Create the tenant's specific database
        const connection = await mysql.createConnection({
            host: dbHost,
            user: process.env.MASTER_DB_USER,
            password: process.env.MASTER_DB_PASSWORD
        });

        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        await connection.end();

        // 3. Create the schema in the tenant's database
        await createTenantSchema(dbName);

        // Return the new account ID upon success
        return accountId;
    } catch (error) {
        console.error(`Error creating tenant: ${error.message}`);

        // If schema creation fails, delete the tenant account and database
        if (accountId) {
            console.log(`Deleting account with ID ${accountId} due to failure in schema creation`);
            await deleteAccount(accountId);
            await deleteTenantSchema(dbName); // Drop the tenant database if created
        }

        // Re-throw the error to propagate it up the call stack
        throw new Error('Failed to create tenant. Rolled back account and database creation.');
    }
};

// Delete a tenant (Account + Database)
const deleteTenant = async (hospitalId, dbName) => {
    // 1. Delete the account from the master database
    await deleteAccount(hospitalId);

    // 2. Drop the tenant's database
    await deleteTenantSchema(dbName);
};

module.exports = { createNewTenant, deleteTenant };