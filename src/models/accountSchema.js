// src/models/accounts.js
const { masterDb } = require('../config/db');

// Create a new hospital account
const createAccount = async (hospitalName, contactName, contactEmail, dbName, dbHost) => {
    const [result] = await masterDb.query(
        `INSERT INTO Accounts (HospitalName, ContactName, ContactEmail, DatabaseName, DatabaseHost, DatabaseUsername, DatabasePassword, SubscriptionStatusID)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [hospitalName, contactName, contactEmail, dbName, dbHost, process.env.TENANT_DB_USER, process.env.TENANT_DB_PASSWORD, 1]
    );
    return result.insertId; // Returns the new account ID
};

// Delete a hospital account
const deleteAccount = async (hospitalId) => {
    await masterDb.query(`DELETE FROM Accounts WHERE ID = ?`, [hospitalId]);
};

module.exports = { createAccount, deleteAccount };