import { format } from 'date-fns';

import { getTenantDb } from '../../db/db';

import { Department, Shift, ShiftTypeEnum } from '../../models';
import { fetchDepartmentScheduleForMonth, getPreviousMonthsSchedule, generateWorkScheduleForDepartment } from './functions';

interface CallScheduleData {
  month: string // 'YYYY-MM' format,
  callShifts: Shift[], // includes user name
  vacationDays: Shift[],
  adminDays: Shift[]
}

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
    console.log("EXISTING SCHDULE FOUND")
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
    console.log("NO SCHDULE FOUND")
    // Get previous month's schedule
    const previousMonthSchedule = await getPreviousMonthsSchedule(hospitalName, month, year, department);

    console.log("previousMonthSchedule", previousMonthSchedule)

    // TODO: We don't want to allow backward navigation / creation of fake previous months
    // NEED TO FIGURE OUT HOW TO CREATE FIRST MONTH OF DATA FOR NEW USERS
    // if (!previousMonthSchedule) {
    //   return;
    // }
    
    // Generate new schedule using previous month's data
    const newCallSchedule = await generateWorkScheduleForDepartment(hospitalName, month, year, department, previousMonthSchedule);

    console.log("newCallSchedule", newCallSchedule)

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