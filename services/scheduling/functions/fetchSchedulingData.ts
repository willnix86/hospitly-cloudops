import { Pool, RowDataPacket } from 'mysql2/promise';
import { User, Vacation, AdminDay, Rule, Department, Position, ShiftType } from '../../../models';

const fetchSchedulingData = async (
  tenantDb: Pool, 
  month: number, 
  year: number,
  department: Department
) : Promise<{
  users: User[], 
  vacations: Vacation[], 
  adminDays: AdminDay[], 
  rules: Rule[], 
  shiftTypes: ShiftType[]
}> => {
  const [positionRows] = await tenantDb.query<RowDataPacket[]>('SELECT * FROM Positions');
  const positions: Position[] = positionRows.map((position: RowDataPacket) => ({
    id: position.ID,
    name: position.Name
  }));

  // Updated user query to include users assigned to the department via Users table or Rotations table
  const [userRows] = await tenantDb.query<RowDataPacket[]>(
    `
    SELECT DISTINCT Users.*
    FROM Users
    LEFT JOIN Rotations ON Users.ID = Rotations.UserID
    WHERE Users.DepartmentID = ? 
      OR (Rotations.DepartmentID = ? 
          AND MONTH(Rotations.StartDate) <= ? 
          AND MONTH(Rotations.EndDate) >= ? 
          AND YEAR(Rotations.StartDate) <= ? 
          AND YEAR(Rotations.EndDate) >= ?)
    `,
    [department.id, department.id, month, month, year, year]
  );

  const users: User[] = userRows.map((user: RowDataPacket) => {
    const position = positions.find(position => position.id == user.PositionID);

    if (!position) { 
      // TODO: Track error - we should have a position
      return null;
    }

    return {
        id: user.ID,
        name: user.Name,
        position: position,
        department: department,
        isEditor: user.isEditor
    } as User;
  }).filter((user): user is User => user != null);

  // Updated SQL query for vacations with user IDs from the updated user list
  const userIds = users.map(user => user.id);
  const [vacationRows] = await tenantDb.query<RowDataPacket[]>(
    `
    SELECT * FROM Vacations 
    WHERE UserID IN (?)
    AND (
      (MONTH(StartDate) = ? AND YEAR(StartDate) = ?)
      OR (MONTH(EndDate) = ? AND YEAR(EndDate) = ?)
      OR (StartDate <= LAST_DAY(DATE(CONCAT(?, '-', ?, '-01'))) AND EndDate >= DATE(CONCAT(?, '-', ?, '-01')))
    )
    `,
    [userIds, month, year, month, year, year, month, year, month]
  );
  
  const vacations: Vacation[] = vacationRows.map((vacation: RowDataPacket) => {
    const user = users.find(user => user.id == vacation.UserID);
    if (!user) { 
      // TODO: Track error - we should have a user
      return null;
    } else {
      return { 
        id: vacation.ID,
        user: user,
        startDate: vacation.StartDate,
        endDate: vacation.EndDate
      } as Vacation;
    }
  }).filter((vacation): vacation is Vacation => vacation != null);

  // Update admin day query to reference the filtered list of users based on both Users and Rotations assignments
  const [adminDaysRows] = await tenantDb.query<RowDataPacket[]>(
    'SELECT * FROM AdminDays WHERE UserID IN (?) AND MONTH(AdminDate) = ? AND YEAR(AdminDate) = ?',
    [userIds, month, year]
  );
  const adminDays: AdminDay[] = adminDaysRows.map((adminDay: RowDataPacket) => {
    const user = users.find(user => user.id == adminDay.UserID);
    if (!user) { 
      // TODO: Track error - we should have a user
      return null;
    } else {
      return {
        id: adminDay.ID,
        user: user,
        date: adminDay.AdminDate
      } as AdminDay;
    }
  }).filter((adminDay): adminDay is AdminDay => adminDay != null);

  const [rulesRows] = await tenantDb.query<RowDataPacket[]>('SELECT * FROM Rules');
  const rules: Rule[] = rulesRows.map((rule: RowDataPacket) => ({
    id: rule.ID,
    name: rule.Name,
    value: rule.Value,
    unit: rule.Unit
  }));

  const [shiftTypeRows] = await tenantDb.query<RowDataPacket[]>('SELECT * FROM ShiftTypes');
  const shiftTypes: ShiftType[] = shiftTypeRows.map((shiftType: RowDataPacket) => ({
    id: shiftType.ID,
    name: shiftType.Name,
    startTime: shiftType.StartTime,
    endTime: shiftType.EndTime
  }));

  return { users, vacations, adminDays, rules, shiftTypes };
};

export default fetchSchedulingData;