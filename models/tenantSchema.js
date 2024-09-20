// src/models/tenantSchema.js
const { getTenantDb } = require('../config/db');

// Function to create schema in the tenant's database
const createTenantSchema = async (dbName) => {
    const tenantDb = await getTenantDb(dbName);

    // Create Positions table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Positions (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(50) NOT NULL
        )
    `);

    // Create Departments table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Departments (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(100) NOT NULL
        )
    `);

    // Create Users table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Users (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            PositionID INT,
            DepartmentID INT,
            isEditor BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (PositionID) REFERENCES Positions(ID) ON DELETE SET NULL,
            FOREIGN KEY (DepartmentID) REFERENCES Departments(ID) ON DELETE SET NULL
        )
    `);

    // Create Months table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Months (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            MonthName VARCHAR(20) NOT NULL,
            isFaceMonth BOOLEAN DEFAULT FALSE
        )
    `);

    // Create Weeks table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Weeks (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            WeekNumber INT NOT NULL,
            MonthID INT,
            isHandWeek BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (MonthID) REFERENCES Months(ID) ON DELETE CASCADE
        )
    `);

    // Create DaysOfWeek table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS DaysOfWeek (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            DayName VARCHAR(20) NOT NULL,
            WeekID INT,
            isFaceMonth BOOLEAN DEFAULT FALSE,
            isHandWeek BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (WeekID) REFERENCES Weeks(ID) ON DELETE CASCADE
        )
    `);

    // Create ShiftTypes lookup table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS ShiftTypes (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(50) NOT NULL
        )
    `);

    // Create Shifts table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Shifts (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT,
            DayID INT,
            ShiftTypeID INT,
            StartTime TIME NOT NULL,
            EndTime TIME NOT NULL,
            FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE,
            FOREIGN KEY (DayID) REFERENCES DaysOfWeek(ID) ON DELETE CASCADE,
            FOREIGN KEY (ShiftTypeID) REFERENCES ShiftTypes(ID) ON DELETE SET NULL
        )
    `);

    // Create RequestTypes lookup table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS RequestTypes (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(50) NOT NULL
        )
    `);

    // Create StatusTypes lookup table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS StatusTypes (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            Name VARCHAR(50) NOT NULL
        )
    `);

    // Create Requests table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS Requests (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT,
            RequestTypeID INT,
            StatusID INT,
            StartDate DATE NOT NULL,
            EndDate DATE NOT NULL,
            CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE,
            FOREIGN KEY (RequestTypeID) REFERENCES RequestTypes(ID) ON DELETE SET NULL,
            FOREIGN KEY (StatusID) REFERENCES StatusTypes(ID) ON DELETE SET NULL
        )
    `);

    // Create ShiftSwaps table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS ShiftSwaps (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            RequesterID INT,
            RecipientID INT,
            OriginalShiftID INT,
            ProposedShiftID INT,
            StatusID INT,
            ReviewedBy INT,
            FOREIGN KEY (RequesterID) REFERENCES Users(ID) ON DELETE CASCADE,
            FOREIGN KEY (RecipientID) REFERENCES Users(ID) ON DELETE CASCADE,
            FOREIGN KEY (OriginalShiftID) REFERENCES Shifts(ID) ON DELETE CASCADE,
            FOREIGN KEY (ProposedShiftID) REFERENCES Shifts(ID) ON DELETE CASCADE,
            FOREIGN KEY (StatusID) REFERENCES StatusTypes(ID) ON DELETE SET NULL,
            FOREIGN KEY (ReviewedBy) REFERENCES Users(ID) ON DELETE SET NULL
        )
    `);

    // Create AdminDays table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS AdminDays (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT,
            AdminDate DATE NOT NULL,
            FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
        )
    `);

    // Create VacationDays table
    await tenantDb.query(`
        CREATE TABLE IF NOT EXISTS VacationDays (
            ID INT AUTO_INCREMENT PRIMARY KEY,
            UserID INT,
            VacationDate DATE NOT NULL,
            FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
        )
    `);
    // Create the stored procedure to populate enum tables
    await tenantDb.query(`
        CREATE PROCEDURE PopulateEnumTables()
        BEGIN
            -- Insert values into ShiftTypes table
            INSERT INTO ShiftTypes (Name) VALUES 
            ('Day Shift'), 
            ('Night Shift'), 
            ('On-Call Shift');
            
            -- Insert values into RequestTypes table
            INSERT INTO RequestTypes (Name) VALUES 
            ('Vacation'), 
            ('Weekend Off');

            -- Insert values into StatusTypes table
            INSERT INTO StatusTypes (Name) VALUES 
            ('Pending'), 
            ('Approved'), 
            ('Denied');

            -- Insert values into Positions table
            INSERT INTO Positions (Name) VALUES 
            ('Intern'), 
            ('Junior'), 
            ('Senior'), 
            ('Attending');

            -- Insert values into Departments table
            INSERT INTO Departments (Name) VALUES 
            ('Internal Medicine'), 
            ('Surgery'), 
            ('Pediatrics'), 
            ('Emergency Medicine'), 
            ('Cardiology'), 
            ('Oncology');
        END
    `);

    // Call the stored procedure to populate the tables
    await tenantDb.query(`CALL PopulateEnumTables();`);
};

// Function to drop tenant's database schema
const deleteTenantSchema = async (dbName) => {
    const tenantDb = await getTenantDb(dbName);
    await tenantDb.query(`DROP DATABASE IF EXISTS ${dbName}`);
};

module.exports = { createTenantSchema, deleteTenantSchema };