import { RowDataPacket } from 'mysql2/promise';

export interface Rule {
  id: number;
  name: string;
  value: number;
  unit: string;
  description?: string;
}