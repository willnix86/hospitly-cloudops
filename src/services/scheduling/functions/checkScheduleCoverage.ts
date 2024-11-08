import { Schedule, ShiftTypeEnum } from "../../../models";

const checkScheduleCoverage = (schedule: Schedule, month: number, year: number): boolean => {
    const juniorPositions = new Set(['PGY1', 'PGY2', 'PGY3']);
    const seniorPositions = new Set(['PGY4', 'PGY5', 'PGY6']);
    
    const daysInMonth = new Date(year, month, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
        let hasJunior = false;
        let hasSenior = false;
        
        for (const userSchedule of Object.values(schedule)) {
            const shift = userSchedule.shifts.find(s => {
                // Convert string date to Date object for comparison
                const shiftDate = new Date(s.date);
                return shiftDate.getFullYear() === year &&
                       shiftDate.getMonth() === month - 1 &&
                       shiftDate.getDate() === day &&
                       s.shiftType.name === ShiftTypeEnum.OnCall;
            });
            
            if (shift) {
                const position = shift.user.position.name;
                if (juniorPositions.has(position)) {
                    hasJunior = true;
                } else if (seniorPositions.has(position)) {
                    hasSenior = true;
                }
                
                if (hasJunior && hasSenior) {
                    break;
                }
            }
        }
        
        if (!hasJunior || !hasSenior) {
            return false;
        }
    }
    return true;
};

export default checkScheduleCoverage;