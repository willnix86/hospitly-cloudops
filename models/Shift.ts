import { User } from './User.ts';

export interface Shift {
    id?: number;
    user: User;
    day: DayOfWeek;
    shiftType: ShiftType;
    startTime: string;  // e.g., "06:00:00"
    endTime: string;    // e.g., "18:00:00"
}

export interface ShiftType {
    id?: number;
    name: string;
    startTime: string;  // e.g., "06:00:00"
    endTime: string;    // e.g., "18:00:00"
}

export interface Schedule {
    [userName: string]: { [date: string]: string };
} 

export interface DayOfWeek {
    id?: number;
    dayName: string;
    weekId: number | null;
    isHandWeek: boolean;
}