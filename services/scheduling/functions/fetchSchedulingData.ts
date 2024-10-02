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

  const [userRows] = await tenantDb.query<RowDataPacket[]>('SELECT * FROM Users WHERE DepartmentID = ?', [department.id]);
  const users: User[] = userRows.map((user: RowDataPacket) => {
    const position = positions.find(position => position.id == user.PositionID);
    const isCorrectDepartment = user.DepartmentID == department.id;

    if (!position) { 
      // TODO: Track error - we should have a position
      return null;
    }

    if (!isCorrectDepartment) {
      // TODO: Track error - we should have correct dept
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

  // Updated SQL query for vacations with startDate and endDate
  const [vacationRows] = await tenantDb.query<RowDataPacket[]>(
    `
    SELECT * FROM Vacations 
    WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?)
    AND (
      (MONTH(StartDate) = ? AND YEAR(StartDate) = ?)  -- Vacation starts in this month
      OR (MONTH(EndDate) = ? AND YEAR(EndDate) = ?)  -- Vacation ends in this month
      OR (StartDate <= LAST_DAY(DATE(CONCAT(?, '-', ?, '-01'))) AND EndDate >= DATE(CONCAT(?, '-', ?, '-01')))  -- Overlaps with this month
    )
    `,
    [department.id, month, year, month, year, year, month, year, month]
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

  const [adminDaysRows] = await tenantDb.query<RowDataPacket[]>(
    'SELECT * FROM AdminDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(AdminDate) = ? AND YEAR(AdminDate) = ?',
    [department.id, month, year]
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