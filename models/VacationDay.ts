import { RowDataPacket } from 'mysql2/promise';

export interface VacationDay {
  id?: number;
  userId: number;
  date: string; // e.g., "YYYY-MM-DD"
}

export interface AdminDay {
  id?: number;
  userId: number;
  date: string; // e.g., "YYYY-MM-DD"
}

export interface Request {
    id?: number;
    userId: number;
    requestTypeId: number;
    statusId: number;
    startDate: string; // e.g., "YYYY-MM-DD"
    endDate: string;   // e.g., "YYYY-MM-DD"
    createdAt: string; // Timestamp of when the request was created
}