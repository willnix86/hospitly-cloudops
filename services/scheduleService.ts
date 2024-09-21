import { Pool } from 'mysql2/promise';
import { getTenantDb } from '../db/db';
import { User, VacationDay, AdminDay, Rule } from '../models';

interface Schedule {
  [userId: number]: string[];
}

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

const fetchSchedulingData = async (tenantDb: Pool, month: number, year: number, departmentID: number) => {
  const [users] = await tenantDb.query<User[]>('SELECT * FROM Users WHERE DepartmentID = ?', [departmentID]);
  const [vacations] = await tenantDb.query<VacationDay[]>(
    'SELECT * FROM VacationDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(VacationDate) = ? AND YEAR(VacationDate) = ?',
    [departmentID, month, year]
  );
  const [adminDays] = await tenantDb.query<AdminDay[]>(
    'SELECT * FROM AdminDays WHERE UserID IN (SELECT ID FROM Users WHERE DepartmentID = ?) AND MONTH(AdminDate) = ? AND YEAR(AdminDate) = ?',
    [departmentID, month, year]
  );
  const [rules] = await tenantDb.query<Rule[]>('SELECT * FROM Rules');

  return { users, vacations, adminDays, rules };
};

const generateInitialSchedule = (users: User[], daysInMonth: number): Schedule => {
  const schedule: Schedule = {};

  users.forEach(user => {
    schedule[user.ID] = Array(daysInMonth).fill('Day Shift: 6 AM - 6 PM');
  });

  return schedule;
};

const applyVacationsAndAdminDays = (schedule: Schedule, vacations: VacationDay[], adminDays: AdminDay[]): Schedule => {
  vacations.forEach(vacation => {
    const userSchedule = schedule[vacation.UserID];
    const vacationDay = new Date(vacation.VacationDate).getDate() - 1;
    if (userSchedule) userSchedule[vacationDay] = 'Vacation';
  });

  adminDays.forEach(admin => {
    const userSchedule = schedule[admin.UserID];
    const adminDay = new Date(admin.AdminDate).getDate() - 1;
    if (userSchedule) userSchedule[adminDay] = 'Admin';
  });

  return schedule;
};

const enforceRules = (schedule: Schedule, rules: Rule[]): Schedule => {
  const maxWorkHoursRule = rules.find(rule => rule.Name === 'Max Work Hours');
  const minRestAfter24hShiftRule = rules.find(rule => rule.Name === 'Min Rest After 24h Shift');
  const maxConsecutiveNightShiftsRule = rules.find(rule => rule.Name === 'Max Consecutive Night Shifts');
  const maxConsecutiveDayShiftsRule = rules.find(rule => rule.Name === 'Max Consecutive Day Shifts');

  Object.keys(schedule).forEach(userID => {
    const userSchedule = schedule[Number(userID)];
    let hoursWorked = 0;
    let consecutiveNightShifts = 0;
    let consecutiveDayShifts = 0;
    let last24hShiftIndex = -1;

    userSchedule.forEach((day, index) => {
      if (day.includes('Shift')) {
        hoursWorked += 12;
        if (hoursWorked > maxWorkHoursRule!.Value) {
          userSchedule[index] = 'Off';
        }
      }

      if (day === 'On-Call Shift: 6 AM - 6 AM') {
        last24hShiftIndex = index;
      }
      if (minRestAfter24hShiftRule && last24hShiftIndex !== -1 && index - last24hShiftIndex <= minRestAfter24hShiftRule.Value / 24) {
        userSchedule[index] = 'Off';
      }

      if (day === 'Night Shift: 6 PM - 6 AM') {
        consecutiveNightShifts++;
        consecutiveDayShifts = 0;
        if (consecutiveNightShifts > maxConsecutiveNightShiftsRule!.Value) {
          userSchedule[index] = 'Off';
        }
      } else {
        consecutiveNightShifts = 0;
      }

      if (day === 'Day Shift: 6 AM - 6 PM') {
        consecutiveDayShifts++;
        consecutiveNightShifts = 0;
        if (consecutiveDayShifts > maxConsecutiveDayShiftsRule!.Value) {
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