import { RowDataPacket } from 'mysql2/promise';

export interface Rule extends RowDataPacket {
  id: number;
  name: string;
  value: number;
  unit: string;
  description?: string;
}