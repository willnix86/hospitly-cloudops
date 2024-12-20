import { getTenantDb } from './db';
import { Pool } from 'mysql2/promise';

export const createTenantSchema = async (hospitalName: string): Promise<void> => {
  const tenantDb: Pool = await getTenantDb(hospitalName);

  // Create the stored procedure to create tables and copy data from the master database
  await tenantDb.query(`
        CREATE PROCEDURE SetupTenantSchema()
        BEGIN
            -- Create Positions table
            CREATE TABLE IF NOT EXISTS Positions (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(50) NOT NULL
            );

            -- Create Departments table
            CREATE TABLE IF NOT EXISTS Departments (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(100) NOT NULL
            );

            -- Create ShiftTypes table
            CREATE TABLE IF NOT EXISTS ShiftTypes (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(50) NOT NULL,
                StartTime TIME NOT NULL,
                EndTime TIME NOT NULL
            );

            -- Create Rules table
            CREATE TABLE IF NOT EXISTS Rules (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                Value INT NOT NULL,
                Unit VARCHAR(50) NOT NULL,
                Description VARCHAR(255)
            );

            -- Create RequestTypes table
            CREATE TABLE IF NOT EXISTS RequestTypes (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(50) NOT NULL
            );

            -- Create StatusTypes table
            CREATE TABLE IF NOT EXISTS StatusTypes (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(50) NOT NULL
            );

            -- Create Users table
            CREATE TABLE IF NOT EXISTS Users (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                Name VARCHAR(255) NOT NULL,
                PositionID INT,
                DepartmentID INT,
                isEditor BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (PositionID) REFERENCES Positions(ID) ON DELETE SET NULL,
                FOREIGN KEY (DepartmentID) REFERENCES Departments(ID) ON DELETE SET NULL
            );

            -- Create Schedules table
            CREATE TABLE IF NOT EXISTS Schedules (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                DepartmentID INT,  -- Department to which the schedule applies
                StartDate DATE,  -- Start of the schedule period (e.g., first of the month)
                EndDate DATE,  -- End of the schedule period (e.g., end of the month)
                FOREIGN KEY (DepartmentID) REFERENCES Departments(ID) ON DELETE CASCADE
            );

            -- Create Shifts table
            CREATE TABLE IF NOT EXISTS Shifts (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT,
                ShiftTypeID INT,
                Date DATE,              -- The specific day the shift happens
                StartTime TIME,
                EndTime TIME,
                ScheduleID INT,         -- Optional, points to a Schedule
                FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE,
                FOREIGN KEY (ShiftTypeID) REFERENCES ShiftTypes(ID) ON DELETE CASCADE,
                FOREIGN KEY (ScheduleID) REFERENCES Schedules(ID) ON DELETE CASCADE
            );

            -- Create Requests table
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
            );

            -- Create ShiftSwaps table
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
            );

            -- Create AdminDays table
            CREATE TABLE IF NOT EXISTS AdminDays (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT,
                AdminDate DATE NOT NULL,
                FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
            );

            -- Create Vacations table
            CREATE TABLE IF NOT EXISTS Vacations (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT,
                StartDate DATE NOT NULL,
                EndDate DATE NOT NULL,
                FOREIGN KEY (UserID) REFERENCES Users(ID) ON DELETE CASCADE
            );

            -- Updated Rotations table
            CREATE TABLE Rotations (
                ID INT AUTO_INCREMENT PRIMARY KEY,
                UserID INT NOT NULL,
                DepartmentID INT NOT NULL,
                StartDate DATE NOT NULL,
                EndDate DATE NOT NULL,
                PositionID INT NOT NULL,
                FOREIGN KEY (UserID) REFERENCES Users(ID),
                FOREIGN KEY (DepartmentID) REFERENCES Departments(ID),
                FOREIGN KEY (PositionID) REFERENCES Positions(ID)
            );

            -- Insert values into Positions table
            INSERT INTO Positions (Name)
            SELECT Name FROM hospitly_master_dev.Positions;

            -- Insert values into Departments table
            INSERT INTO Departments (Name)
            SELECT Name FROM hospitly_master_dev.Departments;

            -- Insert values into ShiftTypes table
            INSERT INTO ShiftTypes (Name, StartTime, EndTime)
            SELECT Name, StartTime, EndTime FROM hospitly_master_dev.ShiftTypes;

            -- Insert values into Rules table
            INSERT INTO Rules (Name, Value, Unit, Description)
            SELECT Name, Value, Unit, Description FROM hospitly_master_dev.Rules;

            -- Insert values into RequestTypes table
            INSERT INTO RequestTypes (Name)
            SELECT Name FROM hospitly_master_dev.RequestTypes;

            -- Insert values into StatusTypes table
            INSERT INTO StatusTypes (Name)
            SELECT Name FROM hospitly_master_dev.StatusTypes;
        END
    `);

  // Call the stored procedure to create tables and populate the default data
  await tenantDb.query(`CALL SetupTenantSchema();`);

  console.log('Tenant schema created and default data populated.');
};

export const deleteTenantSchema = async (hospitalName: string): Promise<void> => {
  const tenantDb: Pool = await getTenantDb(hospitalName);
  await tenantDb.query(`DROP DATABASE IF EXISTS ${hospitalName}`);
};