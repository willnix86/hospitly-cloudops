import { User } from './User';

export interface Vacation {
  id?: number;
  user: User;
  startDate: string; // e.g., "YYYY-MM-DD",
  endDate: string;
}

export interface AdminDay {
  id?: number;
  user: User;
  date: string; 
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