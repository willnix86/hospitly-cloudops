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