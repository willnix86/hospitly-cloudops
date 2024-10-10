import { format, eachDayOfInterval } from 'date-fns'; // Importing date-fns to help with date handling

import { User, Rule, Vacation, AdminDay, Schedule, ShiftTypeEnum } from '../../../models';
import { getShiftTimes } from '../../../models/Shift';
import createShift from './createShift';

const generateCallSchedule = (
  users: User[],
  rules: Rule[],
  vacations: Vacation[],
  adminDays: AdminDay[],
  daysInMonth: number,
  year: number,
  month: number,
  previousMonthSchedule: Schedule | null = null // optional parameter for previous month schedule
): Schedule => {
  const maxWorkHoursRule = rules.find(rule => rule.name === 'Max Work Hours')?.value || 80;

  // Separate users into junior and senior residents based on position
  const juniorResidents = users.filter(user => ['PGY1', 'PGY2', 'PGY3'].includes(user.position.name));
  const seniorResidents = users.filter(user => ['PGY4', 'PGY5', 'PGY6'].includes(user.position.name));

  // Initialize the empty schedule
  const schedule: Schedule = {};
  users.forEach(user => {
    schedule[user.name].shifts = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0]; // Generate date string
      schedule[user.name].shifts.push(createShift(user, date, { name: ShiftTypeEnum.Available, ...getShiftTimes(ShiftTypeEnum.Available) }))
    }
  });

  // Mark vacation and admin days
  const markDaysOff = (user: User, schedule: Schedule) => {
    const userSchedule = schedule[user.name];
  
    // Handle vacations with startDate and endDate
    vacations
      .filter(v => v.user.id === user.id)
      .forEach(v => {
        // Generate the array of dates between startDate and endDate
        const vacationDates = eachDayOfInterval({
          start: new Date(v.startDate),
          end: new Date(v.endDate)
        });
  
        // Mark each date in the vacation period as ShiftTypeEnum.Vacation
        vacationDates.forEach(date => {
          const vacationDate = format(date, 'yyyy-MM-dd'); // Format date to 'YYYY-MM-DD'
          userSchedule[vacationDate] = ShiftTypeEnum.Vacation;
        });
      });
  
    // Handle admin days (no change required)
    adminDays
      .filter(a => a.user.id === user.id)
      .forEach(a => {
        const adminDate = a.date.toString().split('T')[0];
        userSchedule[adminDate] = ShiftTypeEnum.Admin;
      });
  };

  // Helper function to check if user is unavailable
  const isAvailable = (
    user: User, 
    userSchedule: { [date: string]: string }, 
    currentDate: string, 
    previousDate: string
  ): boolean => {
    if (userSchedule[currentDate] === ShiftTypeEnum.Vacation ||
      userSchedule[currentDate] === ShiftTypeEnum.Admin ||
      userSchedule[currentDate] === ShiftTypeEnum.Rest) {
      console.log(`${user.name} is unavailable on ${currentDate} due to vacation, admin, or rest.`);
      return false;
    }

     if (userSchedule[previousDate] === ShiftTypeEnum.OnCall) {
      console.log(`${user.name} cannot work on ${currentDate} due to consecutive shifts.`);
      return false; // Rest needed after an on-call shift
    }

    return true
  }

  // Helper function to check if user can take on-call shift
  const canWorkShift = (user: User, userSchedule: { [date: string]: string }, day: number): boolean => {
    const currentDate = new Date(year, month - 1, day).toISOString().split('T')[0];
    const previousDate = new Date(year, month - 1, day - 1).toISOString().split('T')[0];
  
    console.log(`Checking if ${user.name} can work on ${currentDate}`);
  
    // Ensure no conflicts with vacation, admin, or rest days
    if (!isAvailable(user, userSchedule, currentDate, previousDate)) {
      return false
    }
  
    // Check total shifts and respect the max work hours rule
    const totalOnCallShifts = Object.values(userSchedule).filter(shift => shift === ShiftTypeEnum.OnCall).length;
    if (totalOnCallShifts * 24 >= maxWorkHoursRule) {
      console.log(`${user.name} has reached the max work hours limit.`);
      return false;
    }
  
    console.log(`${user.name} is available to work on ${currentDate}.`);
    return true;
  };

  // Prioritize users with fewer shifts and who were less active in the previous month
  const prioritizeUsersByShiftCountAndPreviousMonth = (users: User[], schedule: Schedule, previousMonthSchedule: Schedule | null): User[] => {
    return users.sort((a, b) => {
      const aShiftsCurrentMonth = Object.values(schedule[a.name]).filter(shift => shift === ShiftTypeEnum.OnCall).length;
      const bShiftsCurrentMonth = Object.values(schedule[b.name]).filter(shift => shift === ShiftTypeEnum.OnCall).length;

      const aShiftsPreviousMonth = previousMonthSchedule
        ? Object.values(previousMonthSchedule[a.name] || {}).filter(shift => shift === ShiftTypeEnum.OnCall).length
        : 0;
      const bShiftsPreviousMonth = previousMonthSchedule
        ? Object.values(previousMonthSchedule[b.name] || {}).filter(shift => shift === ShiftTypeEnum.OnCall).length
        : 0;

      // Sort primarily by total shifts in current month, then by shifts in the previous month
      return (aShiftsCurrentMonth - bShiftsCurrentMonth) || (aShiftsPreviousMonth - bShiftsPreviousMonth);
    });
  };

  // Main function to distribute shifts evenly across residents
  const distributeShifts = (day: number): boolean => {
    if (day > daysInMonth) return true;

    let assignedJunior = false;
    let assignedSenior = false;
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];

    // First assign junior residents, considering the previous month
    const prioritizedJuniorResidents = prioritizeUsersByShiftCountAndPreviousMonth(juniorResidents, schedule, previousMonthSchedule);
    for (const user of prioritizedJuniorResidents) {
      const userSchedule = schedule[user.name];
      if (canWorkShift(user, userSchedule, day) && !assignedJunior) {
        userSchedule[date] = ShiftTypeEnum.OnCall;
        assignedJunior = true;
        break;
      }
    }

    // Then assign senior residents, considering the previous month
    const prioritizedSeniorResidents = prioritizeUsersByShiftCountAndPreviousMonth(seniorResidents, schedule, previousMonthSchedule);
    for (const user of prioritizedSeniorResidents) {
      const userSchedule = schedule[user.name];
      if (canWorkShift(user, userSchedule, day) && !assignedSenior) {
        userSchedule[date] = ShiftTypeEnum.OnCall;
        assignedSenior = true;
        break;
      }
    }

    // Ensure every day has at least one junior and senior resident on-call
    if (!assignedJunior || !assignedSenior) {

      // Reuse the prioritize function to get the resident with the fewest shifts
      const findResidentWithFewestShifts = (residents: User[], schedule: Schedule, previousMonthSchedule: Schedule | null): User | null => {
        const prioritizedResidents = prioritizeUsersByShiftCountAndPreviousMonth(residents, schedule, previousMonthSchedule);
        return prioritizedResidents.length > 0 ? prioritizedResidents[0] : null; // Return the first resident (with the fewest shifts)
      };

      // Force assign a junior resident if none were assigned
      if (!assignedJunior && juniorResidents.length > 0) {
        const selectedJunior = findResidentWithFewestShifts(juniorResidents, schedule, previousMonthSchedule);
        if (selectedJunior) {
          schedule[selectedJunior.name][date] = ShiftTypeEnum.OnCall;
          assignedJunior = true;
        }
      }

      // Force assign a senior resident if none were assigned
      if (!assignedSenior && seniorResidents.length > 0) {
        const selectedSenior = findResidentWithFewestShifts(seniorResidents, schedule, previousMonthSchedule);
        if (selectedSenior) {
          schedule[selectedSenior.name][date] = ShiftTypeEnum.OnCall;
          assignedSenior = true;
        }
      }
    }

    return distributeShifts(day + 1); // Recursively assign the next day
  };

  // Rebalancing function to evenly distribute shifts across all users
  const rebalanceShifts = () => {
    // Step 1: Balance the shift distribution
    const balanceShiftDistribution = (group: User[]) => {
      const shiftsCount = group.map(user => {
        const userSchedule = schedule[user.name];
        const onCallShifts = Object.values(userSchedule).filter(shift => shift === ShiftTypeEnum.OnCall).length;
        return { user, onCallShifts };
      });
  
      const maxShifts = Math.max(...shiftsCount.map(sc => sc.onCallShifts));
      const minShifts = Math.min(...shiftsCount.map(sc => sc.onCallShifts));
  
      if (maxShifts - minShifts > 1) {
        const usersWithMaxShifts = shiftsCount.filter(sc => sc.onCallShifts === maxShifts).map(sc => sc.user);
        const usersWithMinShifts = shiftsCount.filter(sc => sc.onCallShifts === minShifts).map(sc => sc.user);
  
        usersWithMaxShifts.forEach(userWithMax => {
          const userScheduleMax = schedule[userWithMax.name];
  
          // Try to reassign shifts from users with max shifts to those with min shifts
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day).toISOString().split('T')[0];
            if (userScheduleMax[date] === ShiftTypeEnum.OnCall) {
              for (const userWithMin of usersWithMinShifts) {
                const userScheduleMin = schedule[userWithMin.name];
                if (canWorkShift(userWithMin, userScheduleMin, day)) {
                  // Reassign the shift
                  userScheduleMax[date] = '';
                  userScheduleMin[date] = ShiftTypeEnum.OnCall;
                  break;
                }
              }
            }
          }
        });
      }
    };
  
    // Step 2: Reassign consecutive shifts and mark rest days
    const fixConsecutiveShifts = (group: User[]) => {
      group.forEach(user => {
        const userSchedule = schedule[user.name];
        for (let day = 2; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month - 1, day).toISOString().split('T')[0];
          const previousDate = new Date(year, month - 1, day - 1).toISOString().split('T')[0];
    
          // If user has consecutive shifts, attempt to swap the current shift
          if (userSchedule[currentDate] === ShiftTypeEnum.OnCall && userSchedule[previousDate] === ShiftTypeEnum.OnCall) {
            console.log("CONSECUTIVE SHIFT", user.name, "ON", currentDate);
    
            // Find another user who can swap shifts
            const otherUsers = group.filter(u => u.name !== user.name);
            const prioritizedUsers = prioritizeUsersByShiftCountAndPreviousMonth(otherUsers, schedule, null); // Prioritize by least shifts
    
            for (const otherUser of prioritizedUsers) {
              const otherUserSchedule = schedule[otherUser.name];
    
              // Find a day where the other user has an On-Call shift, and swap with the offending currentDate
              for (let swapDay = 1; swapDay <= daysInMonth; swapDay++) {
                const swapDate = new Date(year, month - 1, swapDay).toISOString().split('T')[0];
                const dayBeforeSwapDate = new Date(year, month - 1, swapDay - 1).toISOString().split('T')[0];

    
                if (otherUserSchedule[swapDate] === ShiftTypeEnum.OnCall && isAvailable(user, userSchedule, swapDate, dayBeforeSwapDate)) {
                  // Swap the shifts
                  console.log(`Swapping shift between ${user.name} (currentDate: ${currentDate}) and ${otherUser.name} (swapDate: ${swapDate})`);
    
                  userSchedule[currentDate] = ShiftTypeEnum.Rest;
                  otherUserSchedule[currentDate] = ShiftTypeEnum.OnCall;
                  userSchedule[swapDate] = ShiftTypeEnum.OnCall;
    
                  console.log(`Successfully swapped shift between ${user.name} and ${otherUser.name}`);
                  return;
                }
              }
            }
          }
        }
      });
    };
  
    // Rebalance and fix for both junior and senior residents
    const rebalanceAndFix = (group: User[]) => {
      // Step 1: Balance shifts
      balanceShiftDistribution(group);
      // Step 2: Fix consecutive shifts
      fixConsecutiveShifts(group);
    };

    // Rebalance for both junior and senior residents
    rebalanceAndFix(juniorResidents);
    rebalanceAndFix(seniorResidents);
  };
  // Begin scheduling process for each user
  users.forEach(user => {
    markDaysOff(user, schedule); // Mark vacation/admin days
  });

  // Begin distributing shifts
  distributeShifts(1);

  // Perform rebalancing to ensure fairness
  rebalanceShifts();

  return schedule;
};

export default generateCallSchedule;