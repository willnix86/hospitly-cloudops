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
      .filter(v => v.userId === user.id)
      .forEach(v => {
        const vacationDate = v.date.toString().split('T')[0];
        userSchedule[vacationDate] = 'Off (Vacation)';
      });

    adminDays
      .filter(a => a.userId === user.id)
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

  // Sort users based on whether they had no shifts in the previous month
  const sortUsersByPreviousShifts = (users: User[], previousMonthSchedule: Schedule | null): User[] => {
    if (!previousMonthSchedule) return users;

    const usersWithNoShifts = users.filter(user => {
      const userSchedule = previousMonthSchedule[user.name];
      return userSchedule && !Object.values(userSchedule).includes('On-Call');
    });

    const usersWithShifts = users.filter(user => {
      const userSchedule = previousMonthSchedule[user.name];
      return userSchedule && Object.values(userSchedule).includes('On-Call');
    });

    // Prioritize users with no shifts in the previous month
    return [...usersWithNoShifts, ...usersWithShifts];
  };

  // Main function to distribute shifts evenly across residents
  const distributeShifts = (day: number): boolean => {
    if (day > daysInMonth) return true;

    let assignedUsers = 0;
    const date = new Date(year, month - 1, day).toISOString().split('T')[0];

    const sortedUsers = sortUsersByPreviousShifts(users, previousMonthSchedule);

    sortedUsers.forEach(user => {
      const userSchedule = schedule[user.name];
      if (canWorkShift(user, userSchedule, day) && assignedUsers < 2) {
        userSchedule[date] = 'On-Call';
        assignedUsers++;
      }
    });

    if (assignedUsers < 2) {
      // Not enough coverage for the day
      return false;
    }

    return distributeShifts(day + 1); // Recursively assign the next day
  };

  // Rebalancing function to evenly distribute shifts across all users
  const rebalanceShifts = () => {
    // Step 1: Count the total number of shifts per user
    const shiftsCount = users.map(user => {
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