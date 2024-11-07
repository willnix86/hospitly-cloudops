import { RowDataPacket } from 'mysql2/promise';
import { getTenantDb } from '../../../db/db';
import { Schedule, Department } from '../../../models';
import { generateWorkSchedule, fetchDepartmentScheduleForMonth } from '../scheduleService';

export const regenerateScheduleForDepartment = async (
    hospitalName: string,
    month: number,
    year: number,
    department: Department,
    force: boolean = false
  ): Promise<Schedule> => {
    const tenantDb = await getTenantDb(hospitalName);
  
    // Get the start and end dates for the schedule
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  
    // Check if schedule exists
    const [existingSchedules] = await tenantDb.query<RowDataPacket[]>(
      `SELECT ID FROM Schedules WHERE DepartmentID = ? AND StartDate = ? AND EndDate = ?`,
      [department.id, startDate, endDate]
    );
  
    if (existingSchedules.length > 0) {
      const existingScheduleId = existingSchedules[0].ID;
  
      // Check if schedule is within 7 days of starting and force is false
      const scheduleStart = new Date(startDate);
      const today = new Date();
      const daysUntilStart = Math.floor((scheduleStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
      if (daysUntilStart < 7 && !force) {
        throw new Error('Cannot regenerate schedule within 7 days of start date without force parameter');
      }
  
      // Delete existing shifts
      await tenantDb.query(
        `DELETE FROM Shifts WHERE ScheduleID = ?`,
        [existingScheduleId]
      );
  
      // Delete schedule record
      await tenantDb.query(
        `DELETE FROM Schedules WHERE ID = ?`,
        [existingScheduleId]
      );
    }
  
    // Get previous month's schedule for continuity
    let previousMonth = month - 1;
    let previousYear = year;
    if (previousMonth === 0) {
      previousMonth = 12;
      previousYear--;
    }
  
    const previousMonthSchedule = await fetchDepartmentScheduleForMonth(
      tenantDb,
      previousMonth,
      previousYear,
      department
    );
  
    // Generate new schedule
    const newSchedule = await generateWorkSchedule(
      hospitalName,
      month,
      year,
      department,
      previousMonthSchedule
    );
  
    return newSchedule;
  };