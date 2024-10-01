import { User, Rule, VacationDay, AdminDay, Schedule } from '../../../models';

const generateCallSchedule = (
  users: User[],
  rules: Rule[],
  vacations: VacationDay[],
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
    schedule[user.name] = {};
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day).toISOString().split('T')[0]; // Generate date string
      schedule[user.name][date] = ''; // Empty day to start with
    }
  });

  // Mark vacation and admin days
  const markDaysOff = (user: User, schedule: Schedule) => {
    const userSchedule = schedule[user.name];
    vacations
      .filter(v => v.user.id === user.id)
      .forEach(v => {
        const vacationDate = v.date.toString().split('T')[0];
        userSchedule[vacationDate] = 'Off (Vacation)';
      });

    adminDays
      .filter(a => a.user.id === user.id)
      .forEach(a => {
        const adminDate = a.date.toString().split('T')[0];
        userSchedule[adminDate] = 'Off (Admin)';
      });
  };

  // Helper function to check if user can take on-call shift
  const canWorkShift = (user: User, userSchedule: { [date: string]: string }, day: number): boolean => {
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];
    const prevDay = new Date(year, month - 1, day - 1).toISOString().split('T')[0];

    if (userSchedule[date] === 'Off (Vacation)' || userSchedule[date] === 'Off (Admin)' || userSchedule[date] === 'Off (Rest)') {
      return false;
    }

    const totalOnCallShifts = Object.values(userSchedule).filter(shift => shift === 'On-Call').length;
    if (totalOnCallShifts * 24 >= maxWorkHoursRule) {
      return false;
    }

    // Check rest after 24-hour shift
    if (userSchedule[prevDay] === 'On-Call') {
      return false; // They must rest the next day - adheres to min-rest after 24 hour shift
    }

    // Check if the user had a shift on the last day of the previous month
    if (day === 1 && previousMonthSchedule) {
      const lastDayOfPreviousMonth = new Date(year, month - 2, new Date(year, month - 1, 0).getDate()).toISOString().split('T')[0];
      if (previousMonthSchedule[user.name]?.[lastDayOfPreviousMonth] === 'On-Call') {
        return false;
      }
    }

    return true;
  };

  // Prioritize users with fewer shifts and who were less active in the previous month
  const prioritizeUsersByShiftCountAndPreviousMonth = (users: User[], schedule: Schedule, previousMonthSchedule: Schedule | null) => {
    return users.sort((a, b) => {
      const aShiftsCurrentMonth = Object.values(schedule[a.name]).filter(shift => shift === 'On-Call').length;
      const bShiftsCurrentMonth = Object.values(schedule[b.name]).filter(shift => shift === 'On-Call').length;

      const aShiftsPreviousMonth = previousMonthSchedule
        ? Object.values(previousMonthSchedule[a.name] || {}).filter(shift => shift === 'On-Call').length
        : 0;
      const bShiftsPreviousMonth = previousMonthSchedule
        ? Object.values(previousMonthSchedule[b.name] || {}).filter(shift => shift === 'On-Call').length
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
        userSchedule[date] = 'On-Call';
        assignedJunior = true;
        break;
      }
    }

    // Then assign senior residents, considering the previous month
    const prioritizedSeniorResidents = prioritizeUsersByShiftCountAndPreviousMonth(seniorResidents, schedule, previousMonthSchedule);
    for (const user of prioritizedSeniorResidents) {
      const userSchedule = schedule[user.name];
      if (canWorkShift(user, userSchedule, day) && !assignedSenior) {
        userSchedule[date] = 'On-Call';
        assignedSenior = true;
        break;
      }
    }

    // Ensure every day has at least one junior and senior resident on-call
    if (!assignedJunior || !assignedSenior) {
      // Force assign a resident if no one was available
      if (!assignedJunior && juniorResidents.length > 0) {
        schedule[juniorResidents[0].name][date] = 'On-Call'; // Force assignment
        assignedJunior = true;
      }
      if (!assignedSenior && seniorResidents.length > 0) {
        schedule[seniorResidents[0].name][date] = 'On-Call'; // Force assignment
        assignedSenior = true;
      }
    }

    return distributeShifts(day + 1); // Recursively assign the next day
  };

  // Rebalancing function to evenly distribute shifts across all users
  const rebalanceShifts = () => {
    const rebalanceGroup = (group: User[]) => {
      // Step 1: Count the total number of shifts per user
      const shiftsCount = group.map(user => {
        const userSchedule = schedule[user.name];
        const onCallShifts = Object.values(userSchedule).filter(shift => shift === 'On-Call').length;
        return { user, onCallShifts };
      });

      // Step 2: Identify the users with the most and least shifts
      const maxShifts = Math.max(...shiftsCount.map(sc => sc.onCallShifts));
      const minShifts = Math.min(...shiftsCount.map(sc => sc.onCallShifts));

      // Step 3: Reassign shifts if there's a significant imbalance
      if (maxShifts - minShifts > 1) {
        const usersWithMaxShifts = shiftsCount.filter(sc => sc.onCallShifts === maxShifts).map(sc => sc.user);
        const usersWithMinShifts = shiftsCount.filter(sc => sc.onCallShifts === minShifts).map(sc => sc.user);

        usersWithMaxShifts.forEach(userWithMax => {
          const userScheduleMax = schedule[userWithMax.name];

          // Find an On-Call shift that can be reassigned
          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day).toISOString().split('T')[0];
            if (userScheduleMax[date] === 'On-Call') {
              // Try to find a user with fewer shifts who can take over
              for (const userWithMin of usersWithMinShifts) {
                const userScheduleMin = schedule[userWithMin.name];
                if (canWorkShift(userWithMin, userScheduleMin, day)) {
                  // Reassign the shift
                  userScheduleMax[date] = '';
                  userScheduleMin[date] = 'On-Call';
                  break;
                }
              }
              break;
            }
          }
        });
      }
    };

    // Rebalance junior residents
    rebalanceGroup(juniorResidents);

    // Rebalance senior residents
    rebalanceGroup(seniorResidents);
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