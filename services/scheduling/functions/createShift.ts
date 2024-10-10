import { User, Shift, ShiftType } from '../../../models';

// Helper function to create a new shift
  const createShift = (user: User, date: string, shiftType: ShiftType): Shift => ({
    user,
    date,
    shiftType,
    startTime: '',
    endTime: ''
  });

  export default createShift;