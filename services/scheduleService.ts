import { Pool, RowDataPacket } from 'mysql2/promise';
import { getTenantDb } from '../db/db';
import { User, VacationDay, AdminDay, Rule, Schedule } from '../models';

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

const fetchSchedulingData = async (tenantDb: Pool, month: number, year: number, departmentID: number) => {
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
    vacationDate: vacation.VacationDate
  }));

  const [adminDaysRows] = await tenantDb.query<RowDataPacket[]>(
    'SELECT * FROM AdminDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(AdminDate) = ? AND YEAR(AdminDate) = ?',
    [departmentID, month, year]
  );
  const adminDays: AdminDay[] = adminDaysRows.map((adminDay: RowDataPacket) => ({
    id: adminDay.ID,
    userId: adminDay.UserID,
    adminDate: adminDay.AdminDate
  }));

  const [rulesRows] = await tenantDb.query<RowDataPacket[]>('SELECT * FROM Rules');
  const rules: Rule[] = rulesRows.map((rule: RowDataPacket) => ({
    id: rule.ID,
    name: rule.Name,
    value: rule.Value,
    unit: rule.Unit
  }));

  return { users, vacations, adminDays, rules };
};

const generateInitialSchedule = (users: User[], daysInMonth: number): Schedule => {
  const schedule: Schedule = {};

  users.forEach(user => {
    schedule[user.name] = Array(daysInMonth).fill('Day Shift: 6 AM - 6 PM');
  });

  return schedule;
};

const applyVacationsAndAdminDays = (schedule: Schedule, vacations: VacationDay[], adminDays: AdminDay[]): Schedule => {
  vacations.forEach(vacation => {
    const userSchedule = schedule[vacation.userId];
    const vacationDay = new Date(vacation.vacationDate).getDate() - 1;
    if (userSchedule) userSchedule[vacationDay] = 'Vacation';
  });

  adminDays.forEach(admin => {
    const userSchedule = schedule[admin.userId];
    const adminDay = new Date(admin.adminDate).getDate() - 1;
    if (userSchedule) userSchedule[adminDay] = 'Admin';
  });

  return schedule;
};

const enforceRules = (schedule: Schedule, rules: Rule[]): Schedule => {
  const maxWorkHoursRule = rules.find(rule => rule.name === 'Max Work Hours');
  const minRestAfter24hShiftRule = rules.find(rule => rule.name === 'Min Rest After 24h Shift');
  const maxConsecutiveNightShiftsRule = rules.find(rule => rule.name === 'Max Consecutive Night Shifts');
  const maxConsecutiveDayShiftsRule = rules.find(rule => rule.name === 'Max Consecutive Day Shifts');

  Object.keys(schedule).forEach(userID => {
    const userSchedule = schedule[Number(userID)];
    let hoursWorked = 0;
    let consecutiveNightShifts = 0;
    let consecutiveDayShifts = 0;
    let last24hShiftIndex = -1;

    userSchedule.forEach((day, index) => {
      if (day.includes('Shift')) {
        hoursWorked += 12;
        if (hoursWorked > maxWorkHoursRule!.value) {
          userSchedule[index] = 'Off';
        }
      }

      if (day === 'On-Call Shift: 6 AM - 6 AM') {
        last24hShiftIndex = index;
      }
      if (minRestAfter24hShiftRule && last24hShiftIndex !== -1 && index - last24hShiftIndex <= minRestAfter24hShiftRule.value / 24) {
        userSchedule[index] = 'Off';
      }

      if (day === 'Night Shift: 6 PM - 6 AM') {
        consecutiveNightShifts++;
        consecutiveDayShifts = 0;
        if (consecutiveNightShifts > maxConsecutiveNightShiftsRule!.value) {
          userSchedule[index] = 'Off';
        }
      } else {
        consecutiveNightShifts = 0;
      }

      if (day === 'Day Shift: 6 AM - 6 PM') {
        consecutiveDayShifts++;
        consecutiveNightShifts = 0;
        if (consecutiveDayShifts > maxConsecutiveDayShiftsRule!.value) {
          userSchedule[index] = 'Off';
        }
      } else {
        consecutiveDayShifts = 0;
      }
    });
  });

  return schedule;
};

export const generateSchedule = async (tenantDbName: string, month: number, year: number, departmentID: number): Promise<Schedule> => {
  const tenantDb = await getTenantDb(tenantDbName);
  
  const daysInMonth = getDaysInMonth(month, year);
  
  const { users, vacations, adminDays, rules } = await fetchSchedulingData(tenantDb, month, year, departmentID);

  let schedule = generateInitialSchedule(users, daysInMonth);
  schedule = applyVacationsAndAdminDays(schedule, vacations, adminDays);
  schedule = enforceRules(schedule, rules);

  return schedule;
};