import { getTenantDb } from '../../db/db';
import fetchSchedulingData from './utilities/fetchSchedulingData';
import generateCallSchedule from './utilities/generateCallSchedule';

import { Schedule } from '../../models';

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
  departmentID: number,
  previousMonthSchedule: Schedule | null
): Promise<{[userName: string]: { [date: string]: string }}> => {
  const tenantDb = await getTenantDb(tenantDbName);
  
  const daysInMonth = getDaysInMonth(month, year);
  
  // TODO: fetch precious month schedule from db
  const { users, vacations, adminDays, rules } = await fetchSchedulingData(tenantDb, month, year, departmentID);

  let schedule = generateCallSchedule(users, rules, vacations, adminDays, daysInMonth, year, month, previousMonthSchedule);

  return schedule;
};