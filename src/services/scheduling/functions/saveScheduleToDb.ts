import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { getDaysInMonth } from 'date-fns';

import { getTenantDb } from '../../../db/db';
import { Schedule, Department, User } from '../../../models';
import { dateFromMonthYear } from '../../../utils';

const saveScheduleToDb = async (
    hospitalName: string, 
    schedule: Schedule, 
    month: number, 
    year: number,
    department: Department,
    users: User[],
    isSingleUserUpdate: boolean = false
): Promise<void> => {
    const date = dateFromMonthYear(month, year);
    const tenantDb = await getTenantDb(hospitalName);
  
    const shiftTableName = 'Shifts';
    const schedulesTableName = 'Schedules';
  
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month - 1, getDaysInMonth(date)).toISOString().split('T')[0];
  
    // Check for existing schedule
    const [existingSchedules] = await tenantDb.query<RowDataPacket[]>(
        `SELECT ID FROM ${schedulesTableName} WHERE DepartmentID = ? AND StartDate = ? AND EndDate = ?`,
        [department.id, startDate, endDate]
    );

    let scheduleId: number;

    if (existingSchedules.length > 0) {
        scheduleId = existingSchedules[0].ID;

        if (isSingleUserUpdate) {
            // Only delete shifts for the users in the schedule object
            const userIds = users
                .filter(u => schedule[u.name])
                .map(u => u.id);

            if (userIds.length > 0) {
                await tenantDb.query(
                    `DELETE FROM ${shiftTableName} 
                     WHERE ScheduleID = ? AND UserID IN (?)`,
                    [scheduleId, userIds]
                );
            }
        } else {
            // Delete all shifts for full schedule update
            await tenantDb.query(
                `DELETE FROM ${shiftTableName} WHERE ScheduleID = ?`,
                [scheduleId]
            );
            
            await tenantDb.query(
                `DELETE FROM ${schedulesTableName} WHERE ID = ?`,
                [scheduleId]
            );

            // Insert new schedule record
            const [result] = await tenantDb.query<ResultSetHeader>(
                `INSERT INTO ${schedulesTableName} (DepartmentID, StartDate, EndDate) VALUES (?, ?, ?)`,
                [department.id, startDate, endDate]
            );
            scheduleId = result.insertId;
        }
    } else {
        // Insert new schedule record
        const [result] = await tenantDb.query<ResultSetHeader>(
            `INSERT INTO ${schedulesTableName} (DepartmentID, StartDate, EndDate) VALUES (?, ?, ?)`,
            [department.id, startDate, endDate]
        );
        scheduleId = result.insertId;
    }

    // Insert new shifts
    for (const [userName, userSchedule] of Object.entries(schedule)) {
        const user = users.find(u => u.name === userName);
        if (!user) continue;

        for (const shift of userSchedule.shifts) {
            const { shiftType, date, startTime, endTime } = shift;
            await tenantDb.query(
                `INSERT INTO ${shiftTableName} (UserID, ShiftTypeID, Date, StartTime, EndTime, ScheduleID) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [user.id, shiftType.id, date, startTime, endTime, scheduleId]
            );
        }
    }
};

export default saveScheduleToDb;