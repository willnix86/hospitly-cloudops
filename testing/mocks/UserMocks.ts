import { User } from "../../models/User";

const users: Array<User> = [
  { name: 'Taylor Booth', positionId: 16, departmentId: 32, isEditor: false }, // PGY5, General Surgery
  { name: 'Jordan Cole', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Jamie Hulse', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Jordan Gaweda', positionId: 16, departmentId: 32, isEditor: false }, // PGY5, General Surgery
  { name: 'Morgan Jordan', positionId: 19, departmentId: 32, isEditor: false }, // PGY1, General Surgery
  { name: 'John Quinn', positionId: 16, departmentId: 32, isEditor: false }, // PGY5, General Surgery
  { name: 'Morgan Zlomke', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Alex Akyeampong', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Alex Allen', positionId: 20, departmentId: 32, isEditor: false }, // PGY2, General Surgery
  { name: 'Morgan Huang', positionId: 19, departmentId: 32, isEditor: false }, // PGY1, General Surgery
  { name: 'Jamie Hamlin', positionId: 16, departmentId: 33, isEditor: false }, // PGY5, Plastics
  { name: 'Cassidy Muir', positionId: 17, departmentId: 33, isEditor: true }, // PGY4, Plastics
  { name: 'Casey Maniscalco', positionId: 18, departmentId: 34, isEditor: false }, // PGY3, ENT
  { name: 'Alex Kane', positionId: 20, departmentId: 33, isEditor: false }, // PGY2, Plastics
  { name: 'Taylor Thuman', positionId: 19, departmentId: 33, isEditor: false }, // PGY1, Plastics
  { name: 'Morgan Millay', positionId: 21, departmentId: 35, isEditor: false }, // Resident, Vascular
  { name: 'Cameron Thomson', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Chris Booth', positionId: 16, departmentId: 32, isEditor: false }, // PGY5, General Surgery
  { name: 'Jordan Smith', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Taylor Butler', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Chris Thomson', positionId: 19, departmentId: 33, isEditor: false }, // PGY1, Plastics
  { name: 'Alex Williams', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Taylor Davis', positionId: 21, departmentId: 34, isEditor: false }, // Resident, ENT
  { name: 'Jamie Parker', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Morgan Lewis', positionId: 16, departmentId: 33, isEditor: false }, // PGY5, Plastics
  { name: 'Jordan Walker', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Casey Hall', positionId: 20, departmentId: 32, isEditor: false }, // PGY2, General Surgery
  { name: 'Charlie Harris', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Cameron Clark', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'John Ward', positionId: 20, departmentId: 32, isEditor: false }, // PGY2, General Surgery
  { name: 'Casey Hill', positionId: 16, departmentId: 33, isEditor: false }, // PGY5, Plastics
  { name: 'Chris Scott', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Charlie Adams', positionId: 19, departmentId: 32, isEditor: false }, // PGY1, General Surgery
  { name: 'Taylor Baker', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Jamie Gonzales', positionId: 16, departmentId: 32, isEditor: false }, // PGY5, General Surgery
  { name: 'Cameron Young', positionId: 21, departmentId: 34, isEditor: false }, // Resident, ENT
  { name: 'Alex Edwards', positionId: 21, departmentId: 35, isEditor: false }, // Resident, Vascular
  { name: 'Chris Collins', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Charlie Morris', positionId: 21, departmentId: 32, isEditor: false }, // Resident, General Surgery
  { name: 'John Stewart', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Casey Flores', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Chris Rogers', positionId: 21, departmentId: 34, isEditor: false }, // Resident, ENT
  { name: 'Cameron Powell', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'John Long', positionId: 19, departmentId: 32, isEditor: false }, // PGY1, General Surgery
  { name: 'Jordan Sanchez', positionId: 16, departmentId: 33, isEditor: false }, // PGY5, Plastics
  { name: 'Charlie Price', positionId: 21, departmentId: 34, isEditor: false }, // Resident, ENT
  { name: 'Taylor Bennett', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Jamie Russell', positionId: 21, departmentId: 32, isEditor: false }, // Resident, General Surgery
  { name: 'Cameron Torres', positionId: 18, departmentId: 32, isEditor: false }, // PGY3, General Surgery
  { name: 'Charlie Peterson', positionId: 19, departmentId: 33, isEditor: false }, // PGY1, Plastics
  { name: 'Jordan Martinez', positionId: 21, departmentId: 33, isEditor: false }, // Resident, Plastics
  { name: 'Alex Roberts', positionId: 16, departmentId: 32, isEditor: false }, // PGY5, General Surgery
  { name: 'Morgan Howard', positionId: 18, departmentId: 34, isEditor: false }, // PGY3, ENT
  { name: 'Jamie Perry', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Cameron Bell', positionId: 20, departmentId: 32, isEditor: false }, // PGY2, General Surgery
  { name: 'Chris Baker', positionId: 19, departmentId: 33, isEditor: false }, // PGY1, Plastics
  { name: 'Charlie Turner', positionId: 21, departmentId: 32, isEditor: false }, // Resident, General Surgery
  { name: 'Alex Hernandez', positionId: 17, departmentId: 32, isEditor: false }, // PGY4, General Surgery
  { name: 'Jordan Campbell', positionId: 18, departmentId: 33, isEditor: false }, // PGY3, Plastics
  { name: 'Chris Mitchell', positionId: 21, departmentId: 34, isEditor: false }, // Resident, ENT
  { name: 'Cameron Moore', positionId: 20, departmentId: 32, isEditor: false }, // PGY2, General Surgery
  { name: 'Taylor Evans', positionId: 19, departmentId: 33, isEditor: false }, // PGY1, Plastics
  { name: 'Charlie King', positionId: 21, departmentId: 32, isEditor: false }, // Resident, General Surgery
  { name: 'Alex Wright', positionId: 16, departmentId: 33, isEditor: false }  // PGY5, Plastics
];

module.exports = { users };