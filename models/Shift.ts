import { User } from './User';

enum ShiftTypeEnum {
    OnCall = 'On-Call',
    Vacation = 'Off (Vacation)',
    Admin = 'Off (Admin Day)',
    Rest = 'Off (Rest)',
    Weekend = 'Off (Weekend)',
    Available = ''
}

interface Shift {
    id?: number;
    user: User;
    day: DayOfWeek;
    shiftType: ShiftType;
    startTime: string;  // e.g., "06:00:00"
    endTime: string;    // e.g., "18:00:00"
}

interface ShiftType {
    id?: number;
    name: string;
    startTime: string;  // e.g., "06:00:00"
    endTime: string;    // e.g., "18:00:00"
}

interface Schedule {
    [userName: string]: { [date: string]: string };
} 

interface DayOfWeek {
    id?: number;
    dayName: string;
    weekId: number | null;
    isHandWeek: boolean;
}

export { ShiftTypeEnum, ShiftType, Shift, Schedule, DayOfWeek }