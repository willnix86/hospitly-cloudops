import { RowDataPacket } from 'mysql2/promise';

export interface User {
    id?: number;
    name: string;
    positionId: number;
    departmentId: number;
    isEditor: boolean;
}

export interface Department {
    id: number;
    name: string;
}

export interface Position {
    id: number;
    name: string;
}