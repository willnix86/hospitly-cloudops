import { Pool, RowDataPacket } from 'mysql2/promise';
import { User, VacationDay, AdminDay, Rule, Shift, ShiftType } from '../../../models';

const fetchSchedulingData = async (
    tenantDb: Pool, 
    month: number, 
    year: number,
    departmentID: number
  ) : Promise<{
    users: User[], 
    vacations: VacationDay[], 
    adminDays: AdminDay[], 
    rules: Rule[], 
    shiftTypes: ShiftType[]
  }> => {
    const [userRows] = await tenantDb.query<RowDataPacket[]>('SELECT * FROM Users WHERE DepartmentID = ?', [departmentID]);
    const users: User[] = userRows.map((user: RowDataPacket) => ({
      id: user.ID,
      name: user.Name,
      positionId: user.PositionID,
      departmentId: user.DepartmentID,
      isEditor: user.isEditor
    }));
  
    const [vacationRows] = await tenantDb.query<RowDataPacket[]>(
      'SELECT * FROM VacationDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(VacationDate) = ? AND YEAR(VacationDate) = ?',
      [departmentID, month, year]
    );
    const vacations: VacationDay[] = vacationRows.map((vacation: RowDataPacket) => ({
      id: vacation.ID,
      userId: vacation.UserID,
      date: vacation.VacationDate
    }));
  
    const [adminDaysRows] = await tenantDb.query<RowDataPacket[]>(
      'SELECT * FROM AdminDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(AdminDate) = ? AND YEAR(AdminDate) = ?',
      [departmentID, month, year]
    );
    const adminDays: AdminDay[] = adminDaysRows.map((adminDay: RowDataPacket) => ({
      id: adminDay.ID,
      userId: adminDay.UserID,
      date: adminDay.AdminDate
    }));
  
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