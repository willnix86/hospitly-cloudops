import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  differenceInWeeks, 
  differenceInHours, 
  isAfter, 
  isBefore, 
  addDays, 
  format 
} from 'date-fns';
import { Shift, UserScheduleData, ShiftTypeEnum } from '../../../models';

const transformShiftsToUserScheduleData = (shifts: Shift[], month: number, year: number): UserScheduleData => {
    // Calculate total hours for the specified month
    const monthStart = startOfMonth(new Date(year, month - 1)); // month is 1-based, Date expects 0-based
    const monthEnd = endOfMonth(monthStart);
    const weeksInMonth = differenceInWeeks(monthEnd, monthStart) + 1; // Add 1 because differenceInWeeks rounds down
      
    const totalHours = shifts.reduce((total, shift) => {
      // Combine the shift date with the shift times to create full datetime strings
      const shiftDate = shift.date; // Format: "YYYY-MM-DD"
      const startDateTime = new Date(shiftDate);
      const endDateTime = new Date(shiftDate);
      
      // Parse time strings (format: "HH:mm:ss")
      const [startHours, startMinutes] = shift.startTime.split(':').map(Number);
      const [endHours, endMinutes] = shift.endTime.split(':').map(Number);
      
      startDateTime.setHours(startHours, startMinutes);
      endDateTime.setHours(endHours, endMinutes);

      // Exclude unavailable shifts
      if (shift.shiftType.name === ShiftTypeEnum.Rest || 
          shift.shiftType.name === ShiftTypeEnum.Admin || 
          shift.shiftType.name === ShiftTypeEnum.Vacation) {
        return total;
      }
      
      // Only count shifts that fall within the specified month
      if (isWithinInterval(startDateTime, { start: monthStart, end: monthEnd })) {
        return total + differenceInHours(endDateTime, startDateTime);
      }
      return total;
    }, 0);
  
    // Calculate average hours per week
    const averageHoursPerWeek = totalHours / weeksInMonth;
  
    console.log("TOTAL HOURS", totalHours)
  
    // Generate notifications based on upcoming shifts
    const now = new Date();
    const nextWeek = addDays(now, 7);
    const notifications = shifts
      .filter(shift => {
        const shiftDate = new Date(shift.date);
        const [startHours, startMinutes] = shift.startTime.split(':').map(Number);
        shiftDate.setHours(startHours, startMinutes);
        
        return isAfter(shiftDate, now) && 
               isBefore(shiftDate, nextWeek) &&
               (
                 // Include OnCall, Vacation, and Admin shifts
                 shift.shiftType.name === ShiftTypeEnum.OnCall ||
                 shift.shiftType.name === ShiftTypeEnum.Vacation ||
                 shift.shiftType.name === ShiftTypeEnum.Admin
               );
      })
      .sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        const [aHours, aMinutes] = a.startTime.split(':').map(Number);
        const [bHours, bMinutes] = b.startTime.split(':').map(Number);
        aDate.setHours(aHours, aMinutes);
        bDate.setHours(bHours, bMinutes);
        return aDate.getTime() - bDate.getTime();
      })
      .slice(0, 4)
      .map(shift => {
        let message = '';
        let type = '';
        
        const shiftDate = new Date(shift.date);
        const [startHours, startMinutes] = shift.startTime.split(':').map(Number);
        shiftDate.setHours(startHours, startMinutes);
        
        switch (shift.shiftType.name) {
          case ShiftTypeEnum.OnCall:
            message = `On-Call shift on ${format(shiftDate, 'MMM d')} at ${format(shiftDate, 'h:mm a')}`;
            type = 'upcoming_call';
            break;
          case ShiftTypeEnum.Vacation:
            message = `Vacation starts on ${format(shiftDate, 'MMM d')}`;
            type = 'upcoming_vacation';
            break;
          case ShiftTypeEnum.Admin:
            message = `Admin day on ${format(shiftDate, 'MMM d')}`;
            type = 'upcoming_admin';
            break;
        }
  
        return {
          message,
          type
        };
      });
  
    return {
      shifts,
      workHours: {
        total: Math.round(averageHoursPerWeek * 10) / 10, // Round to 1 decimal place
        remaining: Math.max(0, 80 - Math.round(averageHoursPerWeek * 10) / 10)
      },
      notifications
    };
  };

export default transformShiftsToUserScheduleData;