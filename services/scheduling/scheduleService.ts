import { getTenantDb } from '../../db/db';
import fetchSchedulingData from './functions/fetchSchedulingData';
import generateCallSchedule from './functions/generateCallSchedule';
import populateSchedule from './functions/populateRemainingSchedule';

import { Schedule, Department } from '../../models';
import { createOnCallTable } from '../../testing/helpers/createOnCallTable';

const getDaysInMonth = (
  month: number, 
  year: number
): number => {
  return new Date(year, month, 0).getDate();
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
  
  // TODO: fetch previous month schedule from db
  const { users, vacations, adminDays, rules } = await fetchSchedulingData(tenantDb, month, year, department);

  let callSchedule = generateCallSchedule(users, department, rules, vacations, adminDays, daysInMonth, year, month, previousMonthSchedule);
  let finalSchedule = populateSchedule(callSchedule, users, daysInMonth, year, month)

  // TODO: DELETE THIS
  let table = createOnCallTable(finalSchedule, users, month, year)
  console.log(table)

  return finalSchedule;
};