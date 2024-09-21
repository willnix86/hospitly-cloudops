import { getTenantDb } from '../db/db';
import { User } from '../models';

import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

const addDepartmentIfNotExists = async (tenantDb: Pool, department: string): Promise<number> => {
  const [rows] = await tenantDb.query<RowDataPacket[]>('SELECT ID FROM Departments WHERE Name = ?', [department]);
  if (rows.length === 0) {
    const [result] = await tenantDb.query<ResultSetHeader>('INSERT INTO Departments (Name) VALUES (?)', [department]);
    return result.insertId;
  }
  return rows[0].ID;
};

const addPositionIfNotExists = async (tenantDb: Pool, position: string): Promise<number> => {
  const [rows] = await tenantDb.query<RowDataPacket[]>('SELECT ID FROM Positions WHERE Name = ?', [position]);
  if (rows.length === 0) {
    const [result] = await tenantDb.query<ResultSetHeader>('INSERT INTO Positions (Name) VALUES (?)', [position]);
    return result.insertId;
  }
  return rows[0].ID;
};

export const addUserToTenant = async (hospitalName: string, user: User): Promise<void> => {
  const { name, position, department, isEditor } = user;

  const tenantDb = await getTenantDb(hospitalName);

  const departmentId = await addDepartmentIfNotExists(tenantDb, department);
  const positionId = await addPositionIfNotExists(tenantDb, position);

  await tenantDb.query(
    `INSERT INTO Users (Name, PositionID, DepartmentID, isEditor)
     VALUES (?, ?, ?, ?)`,
    [name, positionId, departmentId, isEditor]
  );

  console.log(`User ${name} added to tenant ${hospitalName}`);
};

export const addUsersToTenant = async (hospitalName: string, users: User[]): Promise<void> => {
  for (const user of users) {
    await addUserToTenant(hospitalName, user);
  }
};