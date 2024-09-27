import { getTenantDb } from '../db/db';
import { User } from '../models';
import { Pool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const addUserToTenant = async (hospitalName: string, user: User): Promise<void> => {
  const { name, position, department, isEditor } = user;

  const tenantDb = await getTenantDb(hospitalName);

  await tenantDb.query(
    `INSERT INTO Users (Name, PositionID, DepartmentID, isEditor)
     VALUES (?, ?, ?, ?)`,
    [name, position.id, department.id, isEditor]
  );

  console.log(`User ${name} added to tenant ${hospitalName}`);
};

export const addUsersToTenant = async (hospitalName: string, users: User[]): Promise<void> => {
  for (const user of users) {
    await addUserToTenant(hospitalName, user);
  }
};