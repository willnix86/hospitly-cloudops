import { getTenantDb } from '../../../db/db';
import { Schedule, Department } from '../../../models';
import { fetchDepartmentScheduleForMonth } from './';

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

  export default getPreviousMonthSchedule;