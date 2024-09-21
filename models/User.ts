import { RowDataPacket } from 'mysql2/promise';

export interface User extends RowDataPacket {
    id: number;
    name: string;
    positionId: number;
    departmentId: number;
    isEditor: boolean;
}

export interface Department extends RowDataPacket {
    id: number;
    name: string;
}

export interface Position extends RowDataPacket {
    id: number;
    name: string;
}