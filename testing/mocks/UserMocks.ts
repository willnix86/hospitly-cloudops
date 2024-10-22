import { User, Position, Department } from '../../src/models';

const positions: Position[] = [
  { id: 16, name: 'PGY5' },
  { id: 17, name: 'PGY4' },
  { id: 18, name: 'PGY3' },
  { id: 19, name: 'PGY1' },
  { id: 20, name: 'PGY2' },
  { id: 21, name: 'Resident' }
];

const departments: Department[] = [
  { id: 32, name: 'General Surgery' },
  { id: 33, name: 'Plastics' },
  { id: 34, name: 'ENT' },
  { id: 35, name: 'Vascular' }
];

const users: User[] = [
  { id: 1, name: 'Taylor Booth', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 2, name: 'Jordan Cole', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 3, name: 'Jamie Hulse', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 4, name: 'Jordan Gaweda', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 5, name: 'Morgan Jordan', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 6, name: 'John Quinn', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 7, name: 'Morgan Zlomke', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 8, name: 'Alex Akyeampong', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 9, name: 'Alex Allen', position: positions.find(p => p.id === 20)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 10, name: 'Morgan Huang', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 11, name: 'Jamie Hamlin', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 12, name: 'Cassidy Muir', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 33)!, isEditor: true },
  { id: 13, name: 'Casey Maniscalco', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 14, name: 'Alex Kane', position: positions.find(p => p.id === 20)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 15, name: 'Taylor Thuman', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 16, name: 'Morgan Millay', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 35)!, isEditor: false },
  { id: 17, name: 'Cameron Thomson', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 18, name: 'Chris Booth', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 19, name: 'Jordan Smith', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 20, name: 'Taylor Butler', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 21, name: 'Chris Thomson', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 22, name: 'Alex Williams', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 23, name: 'Taylor Davis', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 24, name: 'Jamie Parker', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 25, name: 'Morgan Lewis', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 26, name: 'Jordan Walker', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 27, name: 'Casey Hall', position: positions.find(p => p.id === 20)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 28, name: 'Charlie Harris', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 29, name: 'Cameron Clark', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 30, name: 'John Ward', position: positions.find(p => p.id === 20)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 31, name: 'Casey Hill', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 32, name: 'Chris Scott', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 33, name: 'Charlie Adams', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 34, name: 'Taylor Baker', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 35, name: 'Jamie Gonzales', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 36, name: 'Cameron Young', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 37, name: 'Alex Edwards', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 35)!, isEditor: false },
  { id: 38, name: 'Chris Collins', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 39, name: 'Charlie Morris', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 40, name: 'John Stewart', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 41, name: 'Casey Flores', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 42, name: 'Chris Rogers', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 43, name: 'Cameron Powell', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 44, name: 'John Long', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 45, name: 'Jordan Sanchez', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 46, name: 'Charlie Price', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 47, name: 'Taylor Bennett', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 48, name: 'Jamie Russell', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 49, name: 'Cameron Torres', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 50, name: 'Charlie Peterson', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 51, name: 'Jordan Martinez', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 52, name: 'Alex Roberts', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 53, name: 'Morgan Howard', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 54, name: 'Jamie Perry', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 55, name: 'Cameron Bell', position: positions.find(p => p.id === 20)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 56, name: 'Chris Baker', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 57, name: 'Charlie Turner', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 58, name: 'Alex Hernandez', position: positions.find(p => p.id === 17)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 59, name: 'Jordan Campbell', position: positions.find(p => p.id === 18)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 60, name: 'Chris Mitchell', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 34)!, isEditor: false },
  { id: 61, name: 'Cameron Moore', position: positions.find(p => p.id === 20)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 62, name: 'Taylor Evans', position: positions.find(p => p.id === 19)!, department: departments.find(d => d.id === 33)!, isEditor: false },
  { id: 63, name: 'Charlie King', position: positions.find(p => p.id === 21)!, department: departments.find(d => d.id === 32)!, isEditor: false },
  { id: 64, name: 'Alex Wright', position: positions.find(p => p.id === 16)!, department: departments.find(d => d.id === 33)!, isEditor: false }
];

export { users, departments };