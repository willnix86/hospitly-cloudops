import dotenv from 'dotenv';
import mysql, { Pool } from 'mysql2/promise';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

dotenv.config();

export const masterDb: Pool = mysql.createPool({
    host: process.env.MASTER_DB_HOST,
    user: process.env.MASTER_DB_USER,
    password: process.env.MASTER_DB_PASSWORD,
    database: process.env.MASTER_DB_NAME,
    ssl: {
      rejectUnauthorized: true,
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });

export const getTenantDb = async (hospitalName: string): Promise<Pool> => {
    const formattedHospitalName = hospitalName.toLowerCase().replace(/\s/g, '_')

    const dbName = `${formattedHospitalName}_tenant_db`;
    const secretName = `${formattedHospitalName}_credentials`;

    try {
        const secretResponse = await secretsManager.send(new GetSecretValueCommand({ SecretId: secretName }));
        const secretString = secretResponse.SecretString;
        if (!secretString) {
            throw new Error('Secret string is empty');
        }
        const { username, password, host, port } = JSON.parse(secretString);

        return mysql.createPool({
            host,
            port,
            user: username,
            password,
            database: dbName,
            ssl: {
              rejectUnauthorized: true,
            },
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    } catch (error) {
        console.error(`Error getting tenant database connection: ${(error as Error).message}`);
        throw error;
    }
};