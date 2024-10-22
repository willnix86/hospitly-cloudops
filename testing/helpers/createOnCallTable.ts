import { Schedule, User, ShiftTypeEnum, Shift } from '../../src/models';
import { format } from 'date-fns';

const createOnCallTable = (schedule: Schedule, users: User[], month: number, year: number): string => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the given month

    // Separate users into junior and senior residents based on their position
    const juniorResidents = users.filter(user => ['PGY1', 'PGY2', 'PGY3'].includes(user.position.name));
    const seniorResidents = users.filter(user => ['PGY4', 'PGY5', 'PGY6'].includes(user.position.name));

    // Initialize the table string
    let table = `|   Date   | Junior Resident On Call | Senior Resident On Call |\n`;
    table += `|----------|-------------------------|-------------------------|\n`;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = format(new Date(year, month - 1, day), 'yyyy-MM-dd'); // Generate date string
        
        let juniorOnCall: string | null = null;
        let seniorOnCall: string | null = null;

        // Find junior and senior residents on call for this day
        juniorResidents.forEach(user => {
            const userSchedule = schedule[user.name];
            const onCallShift = userSchedule.shifts.find(shift => 
                shift.date === date && shift.shiftType.name === ShiftTypeEnum.OnCall
            );
            if (onCallShift) {
                juniorOnCall = user.name;
            }
        });

        seniorResidents.forEach(user => {
            const userSchedule = schedule[user.name];
            const onCallShift = userSchedule.shifts.find(shift => 
                shift.date === date && shift.shiftType.name === ShiftTypeEnum.OnCall
            );
            if (onCallShift) {
                seniorOnCall = user.name;
            }
        });

        // Add the row to the table
        table += `| ${date} | ${juniorOnCall || 'None'.padEnd(23)} | ${seniorOnCall || 'None'.padEnd(23)} |\n`;
    }

    return table;
};

export { createOnCallTable };