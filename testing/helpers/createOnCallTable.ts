import { Schedule, User } from '../../models';

const createOnCallTable = (schedule: Schedule, users: User[], month: number, year: number): string => {
    const daysInMonth = new Date(year, month, 0).getDate(); // Get the number of days in the given month

    // Separate users into junior and senior residents based on their position
    const juniorResidents = users.filter(user => ['PGY1', 'PGY2', 'PGY3'].includes(user.position.name));
    const seniorResidents = users.filter(user => ['PGY4', 'PGY5', 'PGY6'].includes(user.position.name));

    // Initialize the table string
    let table = `|   Date   | Junior Resident On Call | Senior Resident On Call |\n`;
    table += `|----------|-------------------------|-------------------------|\n`;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day).toISOString().split('T')[0]; // Generate date string
        
        let juniorOnCall: string | null = null;
        let seniorOnCall: string | null = null;

        // Find junior and senior residents on call for this day
        juniorResidents.forEach(user => {
            if (schedule[user.name] && schedule[user.name][date] === 'On-Call') {
                juniorOnCall = user.name;
            }
        });

        seniorResidents.forEach(user => {
            if (schedule[user.name] && schedule[user.name][date] === 'On-Call') {
                seniorOnCall = user.name;
            }
        });

        // Add the row to the table
        table += `| ${date} | ${juniorOnCall || 'None'.padEnd(23)} | ${seniorOnCall || 'None'.padEnd(23)} |\n`;
    }

    return table;
};

export { createOnCallTable };