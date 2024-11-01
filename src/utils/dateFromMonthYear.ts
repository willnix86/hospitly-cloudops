import { set  } from 'date-fns';

const dateFromMonthYear = (month: number, year: number): Date => {
    return set(new Date(), {
        year: year,
        month: month - 1, // Subtract 1 because JavaScript months are 0-based
        date: 1
      });
}

export default dateFromMonthYear;