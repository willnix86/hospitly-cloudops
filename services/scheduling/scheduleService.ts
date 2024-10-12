import { getTenantDb } from '../../db/db';
import fetchSchedulingData from './functions/fetchSchedulingData';
import generateCallSchedule from './functions/generateCallSchedule';
import populateSchedule from './functions/populateRemainingSchedule';

import { Schedule, Department, User } from '../../models';
import { createOnCallTable } from '../../testing/helpers/createOnCallTable';

const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

// Function to save the schedule to the database
const saveScheduleToDb = async (
  tenantDb: any, 
  schedule: Schedule, 
  month: number, 
  year: number,
  department: Department,
  users: User[]
): Promise<void> => {
  // Assuming there's a table named "Shifts" to store shift data
  const shiftTableName = 'Shifts';
  const schedulesTableName = 'Schedules';

  // Determine the start and end dates for the schedule
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month - 1, getDaysInMonth(month, year)).toISOString().split('T')[0];

  // Delete any existing schedule for the same department and date range
  const [existingSchedules] = await tenantDb.query(
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
  const [result] = await tenantDb.query(
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
  tenantDbName: string,
  month: number, 
  year: number,
  department: Department,
  previousMonthSchedule: Schedule | null = null
): Promise<Schedule> => {
  const tenantDb = await getTenantDb(tenantDbName);
  
  const daysInMonth = getDaysInMonth(month, year);
  
  // Fetch scheduling data
  const scheduleData = await fetchSchedulingData(tenantDb, month, year, department);

  // Generate call schedule
  let callSchedule = generateCallSchedule(scheduleData, department, daysInMonth, year, month, previousMonthSchedule);
  
  // Populate remaining schedule
  let finalSchedule = populateSchedule(callSchedule, scheduleData, daysInMonth, year, month);

  // Save the generated schedule to the database
  await saveScheduleToDb(tenantDb, finalSchedule, month, year, department, scheduleData.users);

  // Optional: display the schedule in the console for debugging
  let table = createOnCallTable(finalSchedule, scheduleData.users, month, year);
  console.log(table);

  return finalSchedule;
};