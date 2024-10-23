import { SecretsManagerClient, CreateSecretCommand, GetSecretValueCommand, DeleteSecretCommand } from "@aws-sdk/client-secrets-manager";

import { createAccount, deleteAccount } from '../../db/accountSchema';
import { createTenantSchema, deleteTenantSchema } from '../../db/tenantSchema';
import mysql from 'mysql2/promise';

const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });

export const createNewTenant = async (
  hospitalName: string,
  contactName: string,
  contactEmail: string,
  username: string,
  password: string
): Promise<number> => {
  const formattedHospitalName = hospitalName.toLowerCase().replace(/\s/g, '_')
  const dbName = `${formattedHospitalName}_tenant_db`;
  const dbHost = process.env.MASTER_DB_HOST;

  let accountId: number | undefined;

  try {
    // const tenantDbPassword = Math.random().toString(36).slice(-8);

    // const secretName = `${formattedHospitalName}_credentials`;
    // const secretValue = JSON.stringify({
    //   username: formattedHospitalName,
    //   password: tenantDbPassword,
    //   engine: "mysql",
    //   host: dbHost,
    //   port: 3306,
    //   dbname: dbName
    // });

    // await secretsManager.send(new CreateSecretCommand({
    //   Name: secretName,
    //   SecretString: secretValue
    // }));

    accountId = await createAccount(hospitalName, contactName, contactEmail, dbName, username, password);

    const connection = await mysql.createConnection({
      host: dbHost,
      user: process.env.MASTER_DB_USER,
      password: process.env.MASTER_DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    // await connection.query(`CREATE USER '${formattedHospitalName}'@'%' IDENTIFIED BY '${tenantDbPassword}'`);
    // await connection.query(`GRANT ALL PRIVILEGES ON ${dbName}.* TO '${dbName}'@'%'`);
    // await connection.query('FLUSH PRIVILEGES');
    await connection.end();

    await createTenantSchema(hospitalName);

    return accountId;
  } catch (error) {
    console.error(`Error creating tenant: ${(error as Error).message}`);

    if (accountId) {
      console.log(`Deleting account with ID ${accountId} due to failure in schema creation`);
      await deleteTenant(accountId, dbName);
    }

    throw new Error('Failed to create tenant. Rolled back account and database creation.');
  }
};

export const deleteTenant = async (hospitalId: number, dbName: string): Promise<void> => {
  await deleteAccount(hospitalId);
  await deleteTenantSchema(dbName);

  // const hospitalName = dbName.replace('_tenant_db', '');
  // try {
  //   await secretsManager.send(new DeleteSecretCommand({
  //     SecretId: `${hospitalName}_credentials`,
  //     ForceDeleteWithoutRecovery: true
  //   }));
  // } catch (secretError) {
  //   console.error(`Error deleting secret: ${(secretError as Error).message}`);
  // }
};