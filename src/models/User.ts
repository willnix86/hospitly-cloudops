import { Shift } from ".";

export interface User {
    id?: number;
    name: string;
    position: Position;
    department: Department;
    isEditor: boolean;
}

export interface Department {
    id?: number;
    name: string;
}

export interface Position {
    id?: number;
    name: string;
}
export interface UserScheduleData {
    shifts: Shift[];
    workHours: {
        total: number;
        remaining: number;
    };
    notifications?: Array<{
        message: string;
        type: string;
    }>;
}
