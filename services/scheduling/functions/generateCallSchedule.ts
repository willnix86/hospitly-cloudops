import { format, eachDayOfInterval } from 'date-fns'; // Importing date-fns to help with date handling

import { User, Rule, Department, Vacation, AdminDay, Schedule, ShiftTypeEnum, Shift } from '../../../models';
import { getShiftTimes } from '../../../models/Shift';
import createShift from './createShift';

const generateCallSchedule = (
  users: User[],
  department: Department, // add department as a parameter
  rules: Rule[],
  vacations: Vacation[],
  adminDays: AdminDay[],
  daysInMonth: number,
  year: number,
  month: number,
  previousMonthSchedule: Schedule | null = null // optional parameter for previous month schedule,
): Schedule => {
  const callShift = { name: ShiftTypeEnum.OnCall, ...getShiftTimes(ShiftTypeEnum.OnCall) };
  const vacationShift = { name: ShiftTypeEnum.Vacation, ...getShiftTimes(ShiftTypeEnum.Vacation) };
  const adminShift = { name: ShiftTypeEnum.Admin, ...getShiftTimes(ShiftTypeEnum.Admin) };
  const restShift = { name: ShiftTypeEnum.Rest, ...getShiftTimes(ShiftTypeEnum.Rest) };

  const maxWorkHoursRule = rules.find(rule => rule.name === 'Max Work Hours')?.value || 80;

  const juniorResidents = users.filter(user => { 
    return user.department != department ||
    ['PGY1', 'PGY2', 'PGY3'].includes(user.position.name)
  });

  const seniorResidents = users.filter(user => {
    return user.department == department &&
    ['PGY4', 'PGY5', 'PGY6'].includes(user.position.name)
  });

  const schedule: Schedule = {};
  users.forEach(user => {
    schedule[user.name] = { shifts: [] };
  });

  const markDaysOff = (user: User, schedule: Schedule) => {
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
  };

  const isAvailable = (
    user: User,
    userShifts: Shift[],
    day: number
  ): boolean => {
    const currentDate = new Date(year, month - 1, day).toISOString().split('T')[0];
    const currentShift = userShifts.find(s => s.date == currentDate);

    if (!currentShift) {
      return true;
    }
  
    if (currentShift.shiftType.name === ShiftTypeEnum.Vacation ||
        currentShift.shiftType.name === ShiftTypeEnum.Admin ||
        currentShift.shiftType.name === ShiftTypeEnum.Rest) {
      // console.log(`${user.name} is unavailable on ${currentDate} due to vacation, admin, or rest.`);
      return false;
    }
  
    // Check if the previous or next shift would create consecutive on-call shifts
    if (isConsecutiveShift(user, day)) {
      // console.log(`${user.name} cannot work on ${currentDate} due to consecutive shifts.`);
      return false;
    }
  
    return true;
  };
  
  const canWorkShift = (user: User, userShifts: Shift[], day: number): boolean => {
    // Ensure the user is available 
    if (!isAvailable(user, userShifts, day)) {
      return false;
    }
  
    // Check total shifts and respect the max work hours rule
    const totalOnCallShifts = userShifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length;
    if (totalOnCallShifts * 24 >= maxWorkHoursRule) {
      // console.log(`${user.name} has reached the max work hours limit.`);
      return false;
    }
  
    return true;
  };

  // Function to prioritize users based on the number of shifts they have worked in the current month and the previous month
  const prioritizeUsersByShiftCountAndPreviousMonth = (users: User[], schedule: Schedule, previousMonthSchedule: Schedule | null): User[] => {
    return users.sort((a, b) => {
      const aShiftsCurrentMonth = schedule[a.name].shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length;
      const bShiftsCurrentMonth = schedule[b.name].shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length;

      const aShiftsPreviousMonth = previousMonthSchedule
        ? previousMonthSchedule[a.name].shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length
        : 0;
      const bShiftsPreviousMonth = previousMonthSchedule
        ? previousMonthSchedule[b.name].shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length
        : 0;

      // Sort primarily by total shifts in the current month, then by shifts in the previous month
      return (aShiftsCurrentMonth - bShiftsCurrentMonth) || (aShiftsPreviousMonth - bShiftsPreviousMonth);
    });
  };

  const distributeShifts = (day: number): boolean => {
    if (day > daysInMonth) return true;

    let assignedJunior = false;
    let assignedSenior = false;
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];

    const prioritizedJuniorResidents = prioritizeUsersByShiftCountAndPreviousMonth(juniorResidents, schedule, previousMonthSchedule);
    for (const user of prioritizedJuniorResidents) {
      const userSchedule = schedule[user.name];
      if (canWorkShift(user, userSchedule.shifts, day) && !assignedJunior) {
        if (!userSchedule.shifts.some(s => s.date === date)) {
          userSchedule.shifts.push(createShift(user, date, callShift));
          assignedJunior = true;
        }
        break;
      }
    }

    const prioritizedSeniorResidents = prioritizeUsersByShiftCountAndPreviousMonth(seniorResidents, schedule, previousMonthSchedule);
    for (const user of prioritizedSeniorResidents) {
      const userSchedule = schedule[user.name];
      if (canWorkShift(user, userSchedule.shifts, day) && !assignedSenior) {
        if (!userSchedule.shifts.some(s => s.date === date)) {
          userSchedule.shifts.push(createShift(user, date, callShift));
          assignedSenior = true;
        }
        break;
      }
    }

    if (!assignedJunior || !assignedSenior) {
      const findResidentWithFewestShifts = (residents: User[], schedule: Schedule, previousMonthSchedule: Schedule | null): User | null => {
        const prioritizedResidents = prioritizeUsersByShiftCountAndPreviousMonth(residents, schedule, previousMonthSchedule);
        return prioritizedResidents.length > 0 ? prioritizedResidents[0] : null;
      };

      if (!assignedJunior && juniorResidents.length > 0) {
        const selectedJunior = findResidentWithFewestShifts(juniorResidents, schedule, previousMonthSchedule);
        if (selectedJunior) {
          if (!schedule[selectedJunior.name].shifts.some(s => s.date === date)) {
            schedule[selectedJunior.name].shifts.push(createShift(selectedJunior, date, callShift));
            assignedJunior = true;
          }
        }
      }

      if (!assignedSenior && seniorResidents.length > 0) {
        const selectedSenior = findResidentWithFewestShifts(seniorResidents, schedule, previousMonthSchedule);
        if (selectedSenior) {
          if (!schedule[selectedSenior.name].shifts.some(s => s.date === date)) {
            schedule[selectedSenior.name].shifts.push(createShift(selectedSenior, date, callShift));
            assignedSenior = true;
          }
        }
      }
    }

    return distributeShifts(day + 1);
  };

  const rebalanceShifts = () => {
    // Function to balance shifts and fix any consecutive issues
    const rebalanceAndFix = (group: User[]) => {
      balanceShiftDistribution(group);
      fixConsecutiveShifts(group); // Call fixConsecutiveShifts here
    };
  
    // Distribute shifts among junior and senior residents, and fix any problems
    rebalanceAndFix(juniorResidents);
    rebalanceAndFix(seniorResidents);
  };
  
  const balanceShiftDistribution = (group: User[]) => {
    const shiftsCount = group.map(user => {
      const userSchedule = schedule[user.name];
      const onCallShifts = userSchedule.shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length;
      return { user, onCallShifts };
    });
  
    const maxShifts = Math.max(...shiftsCount.map(sc => sc.onCallShifts));
    const minShifts = Math.min(...shiftsCount.map(sc => sc.onCallShifts));
  
    if (maxShifts - minShifts > 1) {
      const usersWithMaxShifts = shiftsCount.filter(sc => sc.onCallShifts === maxShifts).map(sc => sc.user);
      const usersWithMinShifts = shiftsCount.filter(sc => sc.onCallShifts === minShifts).map(sc => sc.user);
  
      usersWithMaxShifts.forEach(userWithMax => {
        const userScheduleMax = schedule[userWithMax.name].shifts;
  
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, month - 1, day).toISOString().split('T')[0];
          const userMaxShift = userScheduleMax.find(s => s.date === date);
  
          if (userMaxShift && userMaxShift.shiftType.name === ShiftTypeEnum.OnCall) {
            for (const userWithMin of usersWithMinShifts) {
              const userScheduleMin = schedule[userWithMin.name].shifts;
              if (canWorkShift(userWithMin, userScheduleMin, day)) {
                // Reassign the shift from userWithMax to userWithMin
                schedule[userWithMax.name].shifts = userScheduleMax.filter(s => s.date !== date);
                schedule[userWithMin.name].shifts.push(createShift(userWithMin, date, callShift));
                break;
              }
            }
          }
        }
      });
    }
  };
  
  const fixConsecutiveShifts = (group: User[]) => {
    group.forEach(user => {
      const userSchedule = schedule[user.name];
      for (let day = 2; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month - 1, day).toISOString().split('T')[0];
        const previousDate = new Date(year, month - 1, day - 1).toISOString().split('T')[0];
  
        const userCurrentShift = userSchedule.shifts.find(s => s.date === currentDate);
        const userPreviousShift = userSchedule.shifts.find(s => s.date === previousDate);
  
        // Identify consecutive OnCall shifts
        if (userCurrentShift?.shiftType.name === ShiftTypeEnum.OnCall && userPreviousShift?.shiftType.name === ShiftTypeEnum.OnCall) {
          console.log("CONSECUTIVE SHIFT", user.name, "ON", currentDate);
  
          // Assign a rest day for the current shift to break the consecutive pattern
          console.log(`Assigning a rest day to ${user.name} on ${currentDate} to break consecutive shifts`);
          userSchedule.shifts = userSchedule.shifts.filter(s => s.date !== currentDate);
          userSchedule.shifts.push(createShift(user, currentDate, restShift));
  
          // Now try to reassign the on-call shift to another available user
          reassignShiftToAnotherUser(day, group, currentDate);
        }
      }
    });
  };
  
  const reassignShiftToAnotherUser = (day: number, group: User[], date: string) => {
    const availableUsers = group.filter(u => canWorkShift(u, schedule[u.name].shifts, day));
  
    if (availableUsers.length > 0) {
      const selectedUser = availableUsers.sort((a, b) => {
        const aShiftCount = schedule[a.name].shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length;
        const bShiftCount = schedule[b.name].shifts.filter(shift => shift.shiftType.name === ShiftTypeEnum.OnCall).length;
        return aShiftCount - bShiftCount;
      })[0];
  
      // Assign the shift to the selected user
      console.log(`Reassigning the shift on ${date} to ${selectedUser.name}`);
      schedule[selectedUser.name].shifts.push(createShift(selectedUser, date, callShift));
    } else {
      console.log(`No available users found to reassign the shift on ${date}`);
    }
  };
  
  const isConsecutiveShift = (user: User, day: number): boolean => {
    const currentDate = new Date(year, month - 1, day).toISOString().split('T')[0];
    const previousDate = new Date(year, month - 1, day - 1).toISOString().split('T')[0];
    const nextDate = new Date(year, month - 1, day + 1).toISOString().split('T')[0];
  
    const userSchedule = schedule[user.name];
    const currentShift = userSchedule.shifts.find(s => s.date === currentDate);
    const previousShift = userSchedule.shifts.find(s => s.date === previousDate);
    const nextShift = userSchedule.shifts.find(s => s.date === nextDate);
  
    return (
      (currentShift?.shiftType.name === ShiftTypeEnum.OnCall && previousShift?.shiftType.name === ShiftTypeEnum.OnCall) ||
      (currentShift?.shiftType.name === ShiftTypeEnum.OnCall && nextShift?.shiftType.name === ShiftTypeEnum.OnCall)
    );
  };
  
  // Run the rebalancing process
  rebalanceShifts();
  
  // Run the rebalancing process
  rebalanceShifts();

  const sortShiftsByDate = () => {
    users.forEach(user => {
      const userShifts = schedule[user.name].shifts;
      schedule[user.name].shifts = userShifts.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
    });
  };

  users.forEach(user => {
    markDaysOff(user, schedule);
  });

  distributeShifts(1);
  rebalanceShifts();
  sortShiftsByDate();

  return schedule;
};

export default generateCallSchedule;
