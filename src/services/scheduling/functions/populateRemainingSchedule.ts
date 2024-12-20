import { format, isWeekend } from 'date-fns';
import { Schedule, ShiftTypeEnum, ScheduleData } from '../../../models'; // Assuming you have a User and Schedule model already defined
import createShift from './createShift';

const populateSchedule = (
  schedule: Schedule, 
  scheduleData: ScheduleData, 
  daysInMonth: number, 
  year: number, 
  month: number
): Schedule => {
  const { users, shiftTypes } = scheduleData;

  const weekendShift = shiftTypes.find(s => s.name === ShiftTypeEnum.Weekend)!;
  const availableShift = shiftTypes.find(s => s.name === ShiftTypeEnum.Available)!;

  // Iterate through each user in the schedule
  users.forEach(user => {
    const userSchedule = schedule[user.name];
    
    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day); // Create the date object for the given day
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
          userSchedule.shifts.push(createShift(user, formattedDate, availableShift));
        }
      }

      
    }
  });
  
  return schedule; // Return the updated schedule
};

export default populateSchedule;