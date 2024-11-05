import { RowDataPacket } from 'mysql2/promise';

import { getTenantDb } from '../../db/db';
import { fetchSchedulingData, createNewScheduleForUser, saveScheduleToDb } from './functions';
import { Schedule, Department, Shift, User, ScheduleError } from '../../models';

export const getUserSchedule = async (
    hospitalName: string,
    userId: number,
    month: number,
    year: number,
    department: Department
): Promise<Shift[] | ScheduleError> => {
    const tenantDb = await getTenantDb(hospitalName);

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
        },
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

        return shifts;
    } else {
        const scheduleData = await fetchSchedulingData(tenantDb, month, year, department);
        const user = scheduleData.users.find(user => user.id == userId);

        if (!user) {
            return { message: `No user found with id ${userId}`}
        }

        let schedule: Schedule = {};
        schedule = createNewScheduleForUser(user, schedule, scheduleData, month, year)

        // Save the generated schedule to the database
        // await saveScheduleToDb(hospitalName, schedule, month, year, department, [user]);

        return schedule[user.name].shifts;
    }
};
  