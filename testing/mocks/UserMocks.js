const users = [
    { full_name: 'Taylor Booth', position: 'PGY5', department: 'General Surgery', isEditor: false },
    { full_name: 'Jordan Cole', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Jamie Hulse', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Jordan Gaweda', position: 'PGY5', department: 'General Surgery', isEditor: false },
    { full_name: 'Morgan Jordan', position: 'PGY1', department: 'General Surgery', isEditor: false },
    { full_name: 'John Quinn', position: 'PGY5', department: 'General Surgery', isEditor: false },
    { full_name: 'Morgan Zlomke', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Alex Akyeampong', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Alex Allen', position: 'PGY2', department: 'General Surgery', isEditor: false },
    { full_name: 'Morgan Huang', position: 'PGY1', department: 'General Surgery', isEditor: false },
    { full_name: 'Jamie Hamlin', position: 'PGY5', department: 'Plastics', isEditor: false },
    { full_name: 'Cassidy Muir', position: 'PGY4', department: 'Plastics', isEditor: true },
    { full_name: 'Casey Maniscalco', position: 'PGY3', department: 'ENT', isEditor: false },
    { full_name: 'Alex Kane', position: 'PGY2', department: 'Plastics', isEditor: false },
    { full_name: 'Taylor Thuman', position: 'PGY1', department: 'Plastics', isEditor: false },
    { full_name: 'Morgan Millay', position: 'Resident', department: 'Vascular', isEditor: false },
    { full_name: 'Cameron Thomson', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Chris Booth', position: 'PGY5', department: 'General Surgery', isEditor: false },
    { full_name: 'Jordan Smith', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Taylor Butler', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Chris Thomson', position: 'PGY1', department: 'Plastics', isEditor: false },
    { full_name: 'Alex Williams', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Taylor Davis', position: 'Resident', department: 'ENT', isEditor: false },
    { full_name: 'Jamie Parker', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Morgan Lewis', position: 'PGY5', department: 'Plastics', isEditor: false },
    { full_name: 'Jordan Walker', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Casey Hall', position: 'PGY2', department: 'General Surgery', isEditor: false },
    { full_name: 'Charlie Harris', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Cameron Clark', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'John Ward', position: 'PGY2', department: 'General Surgery', isEditor: false },
    { full_name: 'Casey Hill', position: 'PGY5', department: 'Plastics', isEditor: false },
    { full_name: 'Chris Scott', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Charlie Adams', position: 'PGY1', department: 'General Surgery', isEditor: false },
    { full_name: 'Taylor Baker', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Jamie Gonzales', position: 'PGY5', department: 'General Surgery', isEditor: false },
    { full_name: 'Cameron Young', position: 'Resident', department: 'ENT', isEditor: false },
    { full_name: 'Alex Edwards', position: 'Resident', department: 'Vascular', isEditor: false },
    { full_name: 'Chris Collins', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Charlie Morris', position: 'Resident', department: 'General Surgery', isEditor: false },
    { full_name: 'John Stewart', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Casey Flores', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Chris Rogers', position: 'Resident', department: 'ENT', isEditor: false },
    { full_name: 'Cameron Powell', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'John Long', position: 'PGY1', department: 'General Surgery', isEditor: false },
    { full_name: 'Jordan Sanchez', position: 'PGY5', department: 'Plastics', isEditor: false },
    { full_name: 'Charlie Price', position: 'Resident', department: 'ENT', isEditor: false },
    { full_name: 'Taylor Bennett', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Jamie Russell', position: 'Resident', department: 'General Surgery', isEditor: false },
    { full_name: 'Cameron Torres', position: 'PGY3', department: 'General Surgery', isEditor: false },
    { full_name: 'Charlie Peterson', position: 'PGY1', department: 'Plastics', isEditor: false },
    { full_name: 'Jordan Martinez', position: 'Resident', department: 'Plastics', isEditor: false },
    { full_name: 'Alex Roberts', position: 'PGY5', department: 'General Surgery', isEditor: false },
    { full_name: 'Morgan Howard', position: 'PGY3', department: 'ENT', isEditor: false },
    { full_name: 'Jamie Perry', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Cameron Bell', position: 'PGY2', department: 'General Surgery', isEditor: false },
    { full_name: 'Chris Baker', position: 'PGY1', department: 'Plastics', isEditor: false },
    { full_name: 'Charlie Turner', position: 'Resident', department: 'General Surgery', isEditor: false },
    { full_name: 'Alex Hernandez', position: 'PGY4', department: 'General Surgery', isEditor: false },
    { full_name: 'Jordan Campbell', position: 'PGY3', department: 'Plastics', isEditor: false },
    { full_name: 'Chris Mitchell', position: 'Resident', department: 'ENT', isEditor: false },
    { full_name: 'Cameron Moore', position: 'PGY2', department: 'General Surgery', isEditor: false },
    { full_name: 'Taylor Evans', position: 'PGY1', department: 'Plastics', isEditor: false },
    { full_name: 'Charlie King', position: 'Resident', department: 'General Surgery', isEditor: false },
    { full_name: 'Alex Wright', position: 'PGY5', department: 'Plastics', isEditor: false }
];

module.exports = { users };