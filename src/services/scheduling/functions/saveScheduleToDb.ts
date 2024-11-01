import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getDaysInMonth } from 'date-fns';

import { getTenantDb } from '../../../db/db';
import { Schedule, Department, User } from '../../../models';
import { dateFromMonthYear } from '../../../utils';

// Function to save the schedule to the database
const saveScheduleToDb = async (
    hospitalName: string, 
    schedule: Schedule, 
    month: number, 
    year: number,
    department: Department,
    users: User[]
  ): Promise<void> => {
    const date = dateFromMonthYear(month, year);

    const tenantDb = await getTenantDb(hospitalName);
  
    const shiftTableName = 'Shifts';
    const schedulesTableName = 'Schedules';
  
    // Determine the start and end dates for the schedule
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month - 1, getDaysInMonth(date)).toISOString().split('T')[0];
  
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

export default saveScheduleToDb;