import { masterDb } from './db';
import { ResultSetHeader } from 'mysql2';

// Create a new hospital account
export const createAccount = async (
  hospitalName: string,
  contactName: string,
  contactEmail: string,
  dbName: string,
  username: string,
  password: string
): Promise<number> => {
  const [result] = await masterDb.query<ResultSetHeader>(
    `INSERT INTO Accounts (HospitalName, ContactName, ContactEmail, DatabaseName, Username, Password, SubscriptionStatusID, EmailVerified, TwoFactorEnabled)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      hospitalName,
      contactName,
      contactEmail,
      dbName,
      username,
      password,
      1,
      false,
      false
    ]
  );
  return result.insertId;
};

// Delete a hospital account
export const deleteAccount = async (hospitalId: number): Promise<void> => {
  await masterDb.query('DELETE FROM Accounts WHERE ID = ?', [hospitalId]);
};