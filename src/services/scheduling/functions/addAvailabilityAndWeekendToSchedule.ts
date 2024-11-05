import { format, isWeekend, getDaysInMonth } from 'date-fns';
import { Schedule, ShiftTypeEnum, ScheduleData } from '../../../models'; // Assuming you have a User and Schedule model already defined
import createShift from './createShift';
import { dateFromMonthYear } from '../../../utils';

// TODO: Update so that we assign day/night shift based on user(?)

const addAvailabilityAndWeekendToSchedule = (
  schedule: Schedule, 
  scheduleData: ScheduleData, 
  month: number, 
  year: number
): Schedule => {
  const { users, shiftTypes } = scheduleData;
  const date = dateFromMonthYear(month, year);
  const daysInMonth = getDaysInMonth(date);

  const weekendShift = shiftTypes.find(s => s.name === ShiftTypeEnum.Weekend)!;
  const availableShift = shiftTypes.find(s => s.name === ShiftTypeEnum.Available)!;
  const dayShift = shiftTypes.find(s => s.name === ShiftTypeEnum.DayShift)!;
  const nightShift = shiftTypes.find(s => s.name === ShiftTypeEnum.NightShift)!;

  // Iterate through each user in the schedule
  users.forEach(user => {
    if (!schedule[user.name]) {
      schedule[user.name] = { shifts: [] };
    }
    const userSchedule = schedule[user.name];
    
    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      date.setDate(day);
      const formattedDate = format(date, 'yyyy-MM-dd'); // Format the date to match the keys in the schedule

      // Check if there's already a shift for this date
      const existingShift = userSchedule.shifts.find(shift => shift.date === formattedDate);

      // Check if it's a weekend
      if (isWeekend(date)) {
        // If it's a weekend and the user is not on call, mark it as 'Off'
        if (
          !existingShift ||
          (existingShift &&
          existingShift.shiftType.name !== ShiftTypeEnum.OnCall && 
          existingShift.shiftType.name !== ShiftTypeEnum.Vacation &&
          existingShift.shiftType.name !== ShiftTypeEnum.Admin)
        ) {
          userSchedule.shifts.push(createShift(user, formattedDate, weekendShift));
        }
      } else {
        if (!existingShift) {
          userSchedule.shifts.push(createShift(user, formattedDate, dayShift));
        }
      }

      
    }
  });
  
  return schedule; // Return the updated schedule
};

export default addAvailabilityAndWeekendToSchedule;