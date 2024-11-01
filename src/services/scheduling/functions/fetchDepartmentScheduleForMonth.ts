import { RowDataPacket, Pool } from 'mysql2/promise';
import { Schedule, Department } from '../../../models';

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
  
export default fetchDepartmentScheduleForMonth