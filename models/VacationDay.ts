import { User } from './User';

export interface VacationDay {
  id?: number;
  user: User;
  date: string; // e.g., "YYYY-MM-DD"
}

export interface AdminDay {
  id?: number;
  user: User;
  date: string; // e.g., "YYYY-MM-DD"
}

export interface Request {
    id?: number;
    user: User;
    requestTypeId: number;
    statusId: number;
    startDate: string; // e.g., "YYYY-MM-DD"
    endDate: string;   // e.g., "YYYY-MM-DD"
    createdAt: string; // Timestamp of when the request was created
}