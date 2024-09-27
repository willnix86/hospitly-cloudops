import { Pool, RowDataPacket } from 'mysql2/promise';
import { User, VacationDay, AdminDay, Rule, Department, Position, ShiftType } from '../../../models';

const fetchSchedulingData = async (
    tenantDb: Pool, 
    month: number, 
    year: number,
    department: Department
  ) : Promise<{
    users: User[], 
    vacations: VacationDay[], 
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
      const isCorrectDepartment = user.DepartmentID == department.id

      if (!position) { 
        // TODO: Track error - we should have a position
        return null
      }

      if (!isCorrectDepartment) {
        // TODO: Track error - we should have correct dept
        return null
      }

      
      return {
          id: user.ID,
          name: user.Name,
          position: position,
          department: department,
          isEditor: user.isEditor
        } as User
    }).filter((user): user is User => user != null);
  
    const [vacationRows] = await tenantDb.query<RowDataPacket[]>(
      'SELECT * FROM VacationDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(VacationDate) = ? AND YEAR(VacationDate) = ?',
      [department.id, month, year]
    );
    const vacations: VacationDay[] = vacationRows.map((vacation: RowDataPacket) => {
      const user = users.find(user => user.id == vacation.UserID);
      if (!user) { 
        // TODO: Track error - we should have a user
        return null 
      } else {
        return { 
          id: vacation.ID,
          user: user,
          date: vacation.VacationDate
        } as VacationDay
      }
    }).filter((vacation): vacation is VacationDay => vacation != null);
  
    const [adminDaysRows] = await tenantDb.query<RowDataPacket[]>(
      'SELECT * FROM AdminDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(AdminDate) = ? AND YEAR(AdminDate) = ?',
      [department.id, month, year]
    );
    const adminDays: AdminDay[] = adminDaysRows.map((adminDay: RowDataPacket) => {
      const user = users.find(user => user.id == adminDay.UserID);
      if (!user) { 
        // TODO: Track error - we should have a user
        return null 
      } else {
        return {
          id: adminDay.ID,
          user: user,
          date: adminDay.AdminDate
        } as AdminDay
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