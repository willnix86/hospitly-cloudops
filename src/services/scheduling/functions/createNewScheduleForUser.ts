import { format, eachDayOfInterval } from 'date-fns'; // Importing date-fns to help with date handling
import { Schedule, User, ShiftTypeEnum, ScheduleData } from '../../../models';
import createShift from './createShift';
import { addAvailabilityAndWeekendToSchedule } from '.';

const markDaysOff = (user: User, schedule: Schedule, scheduleData: ScheduleData) : Schedule => {
    const { vacations, adminDays, shiftTypes } = scheduleData;

    const vacationShift = shiftTypes.find(s => s.name === ShiftTypeEnum.Vacation)!;
    const adminShift = shiftTypes.find(s => s.name === ShiftTypeEnum.Admin)!;

    const userSchedule = schedule[user.name];

    vacations
      .filter(v => v.user.id === user.id)
      .forEach(v => {
        const vacationDates = eachDayOfInterval({
          start: new Date(v.startDate),
          end: new Date(v.endDate)
        });

        vacationDates.forEach(date => {
          const vacationDate = format(date, 'yyyy-MM-dd');
          if (!userSchedule.shifts.some(s => s.date === vacationDate)) {
            schedule[user.name].shifts.push(createShift(user, vacationDate, vacationShift));
          }
        });
      });

      adminDays
      .filter(a => a.user.id === user.id)
      .forEach(a => {
        const adminDate = a.date.toString().split('T')[0];
        if (!userSchedule.shifts.some(s => s.date === adminDate)) {
          schedule[user.name].shifts.push(createShift(user, adminDate, adminShift));
        }
      });

    return schedule
};

const createNewScheduleForUser = (
  user: User, 
  schedule: Schedule, 
  scheduleData: ScheduleData,
  month: number,
  year: number
) : Schedule => {
    schedule[user.name] = { shifts: [] };

    schedule = markDaysOff(user, schedule, scheduleData)
    schedule = addAvailabilityAndWeekendToSchedule(schedule, scheduleData, month, year)

    return schedule
}

export default createNewScheduleForUser;