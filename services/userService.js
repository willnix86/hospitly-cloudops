const { getTenantDb } = require('../config/db');

// Function to check if a department exists, and add it if not
const addDepartmentIfNotExists = async (tenantDb, department) => {
    const [rows] = await tenantDb.query('SELECT ID FROM Departments WHERE Name = ?', [department]);
    if (rows.length === 0) {
        const [result] = await tenantDb.query('INSERT INTO Departments (Name) VALUES (?)', [department]);
        return result.insertId; // Return new department ID
    }
    return rows[0].ID; // Return existing department ID
};

// Function to check if a position exists, and add it if not
const addPositionIfNotExists = async (tenantDb, position) => {
    const [rows] = await tenantDb.query('SELECT ID FROM Positions WHERE Name = ?', [position]);
    if (rows.length === 0) {
        const [result] = await tenantDb.query('INSERT INTO Positions (Name) VALUES (?)', [position]);
        return result.insertId; // Return new position ID
    }
    return rows[0].ID; // Return existing position ID
};

// Function to add a single user to a tenant's database
const addUserToTenant = async (hospitalName, user) => {
    const { full_name, position, department, isEditor } = user;

    // Get the tenant database
    const tenantDb = await getTenantDb(hospitalName);

    // Add department if it doesn't exist
    const departmentId = await addDepartmentIfNotExists(tenantDb, department);

    // Add position if ict doesn't exist
    const positionId = await addPositionIfNotExists(tenantDb, position);

    // Insert the user into the Users table
    await tenantDb.query(`
        INSERT INTO Users (Name, PositionID, DepartmentID, isEditor)
        VALUES (?, ?, ?, ?)`, [full_name, positionId, departmentId, isEditor]);

    console.log(`User ${full_name} added to tenant ${hospitalName}`);
};

// Function to bulk add multiple users to a tenant's database
const addUsersToTenant = async (hospitalName, users) => {
    for (const user of users) {
        await addUserToTenant(hospitalName, user);
    }
};

module.exports = { addUserToTenant, addUsersToTenant };