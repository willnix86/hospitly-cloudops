import { createAccount, deleteAccount } from '../../db/accountSchema';
import { createTenantSchema, deleteTenantSchema } from '../../db/tenantSchema';
import mysql from 'mysql2/promise';

export const createNewTenant = async (
  hospitalName: string,
  contactName: string,
  contactEmail: string,
  username: string,
  password: string
): Promise<number> => {
  const dbName = `${hospitalName.toLowerCase().replace(/\s/g, '_')}_tenant_db`;
  const dbHost = process.env.MASTER_DB_HOST;

  let accountId: number | undefined;

  try {
    accountId = await createAccount(hospitalName, contactName, contactEmail, dbName, username, password);

    const connection = await mysql.createConnection({
      host: dbHost,
      user: process.env.MASTER_DB_USER,
      password: process.env.MASTER_DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    await connection.end();

    await createTenantSchema(dbName);

    return accountId;
  } catch (error) {
    console.error(`Error creating tenant: ${(error as Error).message}`);

    if (accountId) {
      console.log(`Deleting account with ID ${accountId} due to failure in schema creation`);
      await deleteAccount(accountId);
      await deleteTenantSchema(dbName);
    }

    throw new Error('Failed to create tenant. Rolled back account and database creation.');
  }
};

export const deleteTenant = async (hospitalId: number, dbName: string): Promise<void> => {
  await deleteAccount(hospitalId);
  await deleteTenantSchema(dbName);
};