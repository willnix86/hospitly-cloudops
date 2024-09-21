import { RowDataPacket } from 'mysql2/promise';

export interface Shift {
    id: number;
    userId: number;
    dayId: number;
    shiftTypeId: number;
    startTime: string;  // e.g., "06:00:00"
    endTime: string;    // e.g., "18:00:00"
}

export interface ShiftType {
    id: number;
    name: string;
    startTime: string;  // e.g., "06:00:00"
    endTime: string;    // e.g., "18:00:00"
}

export interface Schedule {
    [name: string]: string[];
}