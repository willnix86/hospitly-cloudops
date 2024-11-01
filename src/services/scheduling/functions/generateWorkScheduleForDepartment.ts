import { getDaysInMonth } from 'date-fns'; // Importing date-fns to help with date handling

import { getTenantDb } from '../../../db/db';
import { Schedule, Department } from '../../../models';
import { 
    saveScheduleToDb, 
    createNewScheduleForUser, 
    generateCallSchedule,
    fetchSchedulingData 
} from '.';
import { dateFromMonthYear } from '../../../utils';

const generateWorkScheduleForDepartment = async (
    hospitalName: string,
    month: number, 
    year: number,
    department: Department,
    previousMonthSchedule: Schedule | null = null
  ): Promise<Schedule> => {
    const date = dateFromMonthYear(month, year);
    const tenantDb = await getTenantDb(hospitalName);
    const daysInMonth = getDaysInMonth(date);
    
    // Fetch scheduling data
    const scheduleData = await fetchSchedulingData(tenantDb, month, year, department);

    // Create schedule and populate with days off
    let schedule: Schedule = {};
    scheduleData.users.forEach(user => {
      schedule = createNewScheduleForUser(user, schedule, scheduleData, month, year)
    });
  
    // Generate call schedule
    let finalSchedule = generateCallSchedule(schedule, scheduleData, department, daysInMonth, year, month, previousMonthSchedule);
  
    // Save the generated schedule to the database
    await saveScheduleToDb(hospitalName, finalSchedule, month, year, department, scheduleData.users);
  
    // // Optional: display the schedule in the console for debugging
    // let table = createOnCallTable(finalSchedule, scheduleData.users, month, year);
    // console.log(table);
  
    return finalSchedule;
};

export default generateWorkScheduleForDepartment;