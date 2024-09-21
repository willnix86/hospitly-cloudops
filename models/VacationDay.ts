import { RowDataPacket } from 'mysql2/promise';

export interface VacationDay extends RowDataPacket {
  id: number;
  userId: number;
  vacationDate: string; // e.g., "YYYY-MM-DD"
}

export interface AdminDay extends RowDataPacket {
  id: number;
  userId: number;
  adminDate: string; // e.g., "YYYY-MM-DD"
}

export interface Request extends RowDataPacket {
    id: number;
    userId: number;
    requestTypeId: number;
    statusId: number;
    startDate: string; // e.g., "YYYY-MM-DD"
    endDate: string;   // e.g., "YYYY-MM-DD"
    createdAt: string; // Timestamp of when the request was created
}