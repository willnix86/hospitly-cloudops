// src/models/accounts.js
const { masterDb } = require('../config/db');

// Create a new hospital account
const createAccount = async (hospitalName, contactName, contactEmail, dbName, username, password) => {
    const [result] = await masterDb.query(
        `INSERT INTO Accounts (HospitalName, ContactName, ContactEmail, DatabaseName, Username, Password, SubscriptionStatusID, EmailVerified, TwoFactorEnabled)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            hospitalName, 
            contactName, 
            contactEmail, 
            dbName, 
            username, 
            password, 
            1, // Default SubscriptionStatusID to 'Trial'
            false,
            false
        ]
    );
    return result.insertId; // Returns the new account ID
};


// Delete a hospital account
const deleteAccount = async (hospitalId) => {
    await masterDb.query(`DELETE FROM Accounts WHERE ID = ?`, [hospitalId]);
};

module.exports = { createAccount, deleteAccount };