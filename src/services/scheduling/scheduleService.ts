import { RowDataPacket, ResultSetHeader, Pool } from 'mysql2/promise';
import { format } from 'date-fns';

import { getTenantDb } from '../../db/db';
import fetchSchedulingData from './functions/fetchSchedulingData';
import generateCallSchedule from './functions/generateCallSchedule';
import populateSchedule from './functions/populateRemainingSchedule';

import { Schedule, Department, User, Position, Shift, ShiftTypeEnum } from '../../models';
import { createOnCallTable } from '../../../testing/helpers/createOnCallTable';

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

// Function to save the schedule to the database
const saveScheduleToDb = async (
  hospitalName: string, 
  schedule: Schedule, 
  month: number, 
  year: number,
  department: Department,
  users: User[]
): Promise<void> => {
  const tenantDb = await getTenantDb(hospitalName);

  const shiftTableName = 'Shifts';
  const schedulesTableName = 'Schedules';

  // Determine the start and end dates for the schedule
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month - 1, getDaysInMonth(month, year)).toISOString().split('T')[0];

  // Delete any existing schedule for the same department and date range
  const [existingSchedules] = await tenantDb.query<RowDataPacket[]>(
    `SELECT ID FROM ${schedulesTableName} WHERE DepartmentID = ? AND StartDate = ? AND EndDate = ?`,
    [department.id, startDate, endDate]
  );

  if (existingSchedules.length > 0) {
    const existingScheduleId = existingSchedules[0].ID;

    // Delete the existing shifts associated with the existing schedule
    await tenantDb.query(
      `DELETE FROM ${shiftTableName} WHERE ScheduleID = ?`,
      [existingScheduleId]
    );

    // Delete the existing schedule record
    await tenantDb.query(
      `DELETE FROM ${schedulesTableName} WHERE ID = ?`,
      [existingScheduleId]
    );
  }

  // Insert a new record into the Schedules table
  const [result] = await tenantDb.query<ResultSetHeader>(
    `INSERT INTO ${schedulesTableName} (DepartmentID, StartDate, EndDate) VALUES (?, ?, ?)`,
    [department.id, startDate, endDate]
  );

  // Get the newly inserted Schedule ID
  const scheduleId = result.insertId;

  // Insert new shifts into the database
  for (const [userName, userSchedule] of Object.entries(schedule)) {
    // Find the user object to get the UserID
    const user = users.find(u => u.name === userName);
    if (!user) continue; // If the user is not found, skip this entry

    for (const shift of userSchedule.shifts) {
      const { shiftType, date, startTime, endTime } = shift;
      await tenantDb.query(
        `INSERT INTO ${shiftTableName} (UserID, ShiftTypeID, Date, StartTime, EndTime, ScheduleID) VALUES (?, ?, ?, ?, ?, ?)`,
        [user.id, shiftType.id, date, startTime, endTime, scheduleId]
      );
    }
  }
};

export const generateWorkSchedule = async (
  hospitalName: string,
  month: number, 
  year: number,
  department: Department,
  previousMonthSchedule: Schedule | null = null
): Promise<Schedule> => {
  const tenantDb = await getTenantDb(hospitalName);
  
  const daysInMonth = getDaysInMonth(month, year);
  
  // Fetch scheduling data
  const scheduleData = await fetchSchedulingData(tenantDb, month, year, department);

  // Generate call schedule
  let callSchedule = generateCallSchedule(scheduleData, department, daysInMonth, year, month, previousMonthSchedule);
  
  // Populate remaining schedule
  let finalSchedule = populateSchedule(callSchedule, scheduleData, daysInMonth, year, month);

  // Save the generated schedule to the database
  await saveScheduleToDb(hospitalName, finalSchedule, month, year, department, scheduleData.users);

  // // Optional: display the schedule in the console for debugging
  // let table = createOnCallTable(finalSchedule, scheduleData.users, month, year);
  // console.log(table);

  return finalSchedule;
};

export const getUserSchedule = async (
  tenantDbName: string,
  userId: number,
  month: number,
  year: number,
  department: Department
): Promise<Schedule | undefined> => {
  const tenantDb = await getTenantDb(tenantDbName);

  // Fetch the user's schedule from the database
  const [scheduleRows] = await tenantDb.query<RowDataPacket[]>(
    `SELECT s.* FROM Schedules s
     JOIN Shifts sh ON s.ID = sh.ScheduleID
     WHERE sh.UserID = ? AND MONTH(s.StartDate) = ? AND YEAR(s.StartDate) = ?`,
    [userId, month, year]
  );

  if (scheduleRows.length > 0) {
    // Schedule exists, fetch and return it
    const scheduleId = scheduleRows[0].ID;
    const [shiftRows] = await tenantDb.query<RowDataPacket[]>(
      `SELECT * FROM Shifts WHERE ScheduleID = ?`,
      [scheduleId]
    );

    // Convert the database rows to a Schedule object
    const schedule: Schedule = {};
    const [userRows] = await tenantDb.query<RowDataPacket[]>(
      `SELECT u.*, p.ID as PositionID, p.Name as PositionName 
       FROM Users u
       JOIN Positions p ON u.PositionID = p.ID
       WHERE u.ID = ?`,
      [userId]
    );

    if (userRows.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userRow = userRows[0];
    const user: User = {
      id: userRow.ID,
      name: userRow.Name,
      position: {
        id: userRow.PositionID,
        name: userRow.PositionName
      } as Position,
      department: department,
      isEditor: userRow.isEditor
    };

    const shifts: Shift[] = shiftRows.map(shift => ({
      user,
      date: shift.Date,
      shiftType: {
        id: shift.ShiftTypeID,
        name: shift.ShiftTypeName,
        startTime: shift.StartTime,
        endTime: shift.EndTime
      },
      startTime: shift.StartTime,
      endTime: shift.EndTime
    }));

    schedule[user.name] = { 
      shifts
    };

    return schedule;
  } else {
    // TODO: Figure out how to create a single user's schedule

    // Schedule doesn't exist, generate a new one
    // const newSchedule = await generateWorkSchedule(tenantDbName, month, year, department);
    
    // // Filter the generated schedule to only include the requested user
    // const userSchedule: Schedule = {};
    // const userName = Object.keys(newSchedule).find(name => newSchedule[name].shifts[0].user.id === userId);
    // if (userName) {
    //   userSchedule[userName] = newSchedule[userName];
    // }

    // return userSchedule;
    return;
  }
};

interface CallScheduleData {
  month: string // 'YYYY-MM' format,
  callShifts: Shift[], // includes user name
  vacationDays: Shift[],
  adminDays: Shift[]
}

const fetchDepartmentScheduleForMonth = async (
  tenantDb: Pool,
  month: number,
  year: number,
  department: Department
): Promise<Schedule | null> => {
  // Determine the start and end dates for the schedule
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];

  // Try to fetch existing schedule
  const [existingSchedules] = await tenantDb.query<RowDataPacket[]>(
    `SELECT s.* FROM Schedules s
     WHERE s.DepartmentID = ? AND s.StartDate = ? AND s.EndDate = ?`,
    [department.id, startDate, endDate]
  );

  if (existingSchedules.length === 0) {
    return null;
  }

  // Fetch all shifts for this schedule
  const [shiftRows] = await tenantDb.query<RowDataPacket[]>(
    `SELECT sh.*, u.*, st.*,
            u.ID as userId, u.Name as userName,
            st.ID as shiftTypeId, st.Name as shiftTypeName,
            p.ID as positionId, p.Name as positionName
     FROM Shifts sh
     JOIN Users u ON sh.UserID = u.ID
     JOIN ShiftTypes st ON sh.ShiftTypeID = st.ID
     JOIN Positions p ON u.PositionID = p.ID
     WHERE sh.ScheduleID = ?`,
    [existingSchedules[0].ID]
  );

  // Convert to Schedule object
  const schedule: Schedule = {};
  
  shiftRows.forEach(row => {
    const user = {
      id: row.userId,
      name: row.userName,
      position: {
        id: row.positionId,
        name: row.positionName,
      },
      department,
      isEditor: row.isEditor,
    };

    if (!schedule[user.name]) {
      schedule[user.name] = { shifts: [] };
    }

    schedule[user.name].shifts.push({
      user,
      date: row.Date,
      shiftType: {
        id: row.shiftTypeId,
        name: row.shiftTypeName,
        startTime: row.StartTime,
        endTime: row.EndTime,
      },
      startTime: row.StartTime,
      endTime: row.EndTime,
    });
  });

  return schedule;
};

const getPreviousMonthSchedule = async (
  hospitalName: string,
  month: number,
  year: number,
  department: Department
): Promise<Schedule | null> => {
  const tenantDb = await getTenantDb(hospitalName);
  
  // Calculate previous month and year
  let previousMonth = month - 1;
  let previousYear = year;
  if (previousMonth === 0) {
    previousMonth = 12;
    previousYear--;
  }

  return fetchDepartmentScheduleForMonth(tenantDb, previousMonth, previousYear, department);
};

export const getCallScheduleData = async (
  hospitalName: string,
  month: number,
  year: number,
  department: Department
): Promise<CallScheduleData | undefined> => {
  const tenantDb = await getTenantDb(hospitalName);

  // Try to fetch existing CallSchedule
  const existingSchedule = await fetchDepartmentScheduleForMonth(tenantDb, month, year, department);

  if (existingSchedule) {
    // Convert existing schedule to CallScheduleData format
    const callShifts: Shift[] = [];
    const vacationDays: Shift[] = [];
    const adminDays: Shift[] = [];

    Object.values(existingSchedule).forEach(userSchedule => {
      userSchedule.shifts.forEach(shift => {
        switch (shift.shiftType.name) {
          case ShiftTypeEnum.OnCall:
            callShifts.push(shift);
            break;
          case ShiftTypeEnum.Vacation:
            vacationDays.push(shift);
            break;
          case ShiftTypeEnum.Admin:
            adminDays.push(shift);
            break;
        }
      });
    });

    const startDate = new Date(year, month - 1, 1);
    return {
      month: format(startDate, 'yyyy-MM'),
      callShifts: callShifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      vacationDays: vacationDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      adminDays: adminDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  } else {
    // Get previous month's schedule
    const previousMonthSchedule = await getPreviousMonthSchedule(hospitalName, month, year, department);

    if (!previousMonthSchedule) {
      return;
    }
    
    // Generate new schedule using previous month's data
    const daysInMonth = new Date(year, month, 0).getDate();
    const scheduleData = await fetchSchedulingData(tenantDb, month, year, department);
    const newCallSchedule = generateCallSchedule(scheduleData, department, daysInMonth, year, month, previousMonthSchedule);

    // Save the new schedule
    await saveScheduleToDb(hospitalName, newCallSchedule, month, year, department, scheduleData.users);

    // Convert and return the schedule in CallScheduleData format
    const callShifts: Shift[] = [];
    const vacationDays: Shift[] = [];
    const adminDays: Shift[] = [];

    Object.values(newCallSchedule).forEach(userSchedule => {
      userSchedule.shifts.forEach(shift => {
        switch (shift.shiftType.name) {
          case ShiftTypeEnum.OnCall:
            callShifts.push(shift);
            break;
          case ShiftTypeEnum.Vacation:
            vacationDays.push(shift);
            break;
          case ShiftTypeEnum.Admin:
            adminDays.push(shift);
            break;
        }
      });
    });

    const startDate = new Date(year, month - 1, 1);
    return {
      month: format(startDate, 'yyyy-MM'),
      callShifts: callShifts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      vacationDays: vacationDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      adminDays: adminDays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    };
  }
};