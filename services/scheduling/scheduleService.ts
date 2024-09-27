import { getTenantDb } from '../../db/db';
import fetchSchedulingData from './functions/fetchSchedulingData';
import generateCallSchedule from './functions/generateCallSchedule';

import { Schedule, Department } from '../../models';

const getDaysInMonth = (
  month: number, 
  year: number
): number => {
  return new Date(year, month, 0).getDate();
};

export const generateSchedule = async (
  tenantDbName: string,
  month: number, 
  year: number,
  department: Department,
  previousMonthSchedule: Schedule | null = null
): Promise<{[userName: string]: { [date: string]: string }}> => {
  const tenantDb = await getTenantDb(tenantDbName);
  
  const daysInMonth = getDaysInMonth(month, year);
  
  // TODO: fetch previous month schedule from db
  const { users, vacations, adminDays, rules } = await fetchSchedulingData(tenantDb, month, year, department);

  let schedule = generateCallSchedule(users, rules, vacations, adminDays, daysInMonth, year, month, previousMonthSchedule);

  return schedule;
};