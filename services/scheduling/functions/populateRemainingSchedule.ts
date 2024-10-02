import { format, isWeekend } from 'date-fns';
import { Schedule, User, ShiftTypeEnum } from '../../../models'; // Assuming you have a User and Schedule model already defined

const populateSchedule = (
  schedule: Schedule, 
  users: User[], 
  daysInMonth: number, 
  year: number, 
  month: number
): Schedule => {
  
  // Iterate through each user in the schedule
  users.forEach(user => {
    const userSchedule = schedule[user.name];
    
    // Loop through each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day); // Create the date object for the given day
      const formattedDate = format(date, 'yyyy-MM-dd'); // Format the date to match the keys in the schedule
      
      // Check if it's a weekend
      if (isWeekend(date)) {
        // If it's a weekend and the user is not on call, mark it as 'Off'
        if (
          userSchedule[formattedDate] !== ShiftTypeEnum.OnCall && 
          userSchedule[formattedDate] !== ShiftTypeEnum.Vacation &&
          userSchedule[formattedDate] !== ShiftTypeEnum.Admin
        ) {
          userSchedule[formattedDate] = ShiftTypeEnum.Weekend;
        }
      } else {
        // If it's a weekday and the user is not on call, mark it as '' (working)
        if (!userSchedule[formattedDate]) {
          userSchedule[formattedDate] = ShiftTypeEnum.Available;
        }
      }
    }
  });
  
  return schedule; // Return the updated schedule
};

export default populateSchedule;