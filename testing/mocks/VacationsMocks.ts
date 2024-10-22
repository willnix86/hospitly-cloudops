import { Vacation } from '../../src/models';
import { users } from "./UserMocks";

const vacations: Vacation[] = [
    { user: users.find(u => u.id === 1)!, startDate: "2024-01-08", endDate: "2024-01-14" },
    { user: users.find(u => u.id === 1)!, startDate: "2024-07-08", endDate: "2024-07-14" },
    { user: users.find(u => u.id === 1)!, startDate: "2024-11-18", endDate: "2024-11-24" },
  
    { user: users.find(u => u.id === 2)!, startDate: "2024-02-05", endDate: "2024-02-11" },
    { user: users.find(u => u.id === 2)!, startDate: "2024-08-12", endDate: "2024-08-18" },
    { user: users.find(u => u.id === 2)!, startDate: "2024-12-09", endDate: "2024-12-15" },
  
    { user: users.find(u => u.id === 3)!, startDate: "2024-03-04", endDate: "2024-03-10" },
    { user: users.find(u => u.id === 3)!, startDate: "2024-09-16", endDate: "2024-09-22" },
    { user: users.find(u => u.id === 3)!, startDate: "2024-10-14", endDate: "2024-10-20" },
  
    { user: users.find(u => u.id === 4)!, startDate: "2024-04-08", endDate: "2024-04-14" },
    { user: users.find(u => u.id === 4)!, startDate: "2024-07-22", endDate: "2024-07-28" },
    { user: users.find(u => u.id === 4)!, startDate: "2024-11-25", endDate: "2024-12-01" },
  
    { user: users.find(u => u.id === 5)!, startDate: "2024-05-06", endDate: "2024-05-12" },
    { user: users.find(u => u.id === 5)!, startDate: "2024-09-02", endDate: "2024-09-08" },
    { user: users.find(u => u.id === 5)!, startDate: "2024-11-04", endDate: "2024-11-10" },
  
    { user: users.find(u => u.id === 6)!, startDate: "2024-06-03", endDate: "2024-06-09" },
    { user: users.find(u => u.id === 6)!, startDate: "2024-08-05", endDate: "2024-08-11" },
    { user: users.find(u => u.id === 6)!, startDate: "2024-11-11", endDate: "2024-11-17" },
  
    { user: users.find(u => u.id === 7)!, startDate: "2024-04-01", endDate: "2024-04-07" },
    { user: users.find(u => u.id === 7)!, startDate: "2024-07-15", endDate: "2024-07-21" },
    { user: users.find(u => u.id === 7)!, startDate: "2024-09-23", endDate: "2024-09-29" },
  
    { user: users.find(u => u.id === 8)!, startDate: "2024-03-18", endDate: "2024-03-24" },
    { user: users.find(u => u.id === 8)!, startDate: "2024-09-09", endDate: "2024-09-15" },
    { user: users.find(u => u.id === 8)!, startDate: "2024-11-18", endDate: "2024-11-24" },
  
    { user: users.find(u => u.id === 9)!, startDate: "2024-05-13", endDate: "2024-05-19" },
    { user: users.find(u => u.id === 9)!, startDate: "2024-09-30", endDate: "2024-10-06" },
    { user: users.find(u => u.id === 9)!, startDate: "2024-11-25", endDate: "2024-12-01" },
  
    { user: users.find(u => u.id === 10)!, startDate: "2024-04-22", endDate: "2024-04-28" },
    { user: users.find(u => u.id === 10)!, startDate: "2024-08-26", endDate: "2024-09-01" },
    { user: users.find(u => u.id === 10)!, startDate: "2024-12-16", endDate: "2024-12-22" },
  
    { user: users.find(u => u.id === 11)!, startDate: "2024-01-22", endDate: "2024-01-28" },
    { user: users.find(u => u.id === 11)!, startDate: "2024-08-05", endDate: "2024-08-11" },
    { user: users.find(u => u.id === 11)!, startDate: "2024-11-11", endDate: "2024-11-17" },
  
    { user: users.find(u => u.id === 12)!, startDate: "2024-03-25", endDate: "2024-03-31" },
    { user: users.find(u => u.id === 12)!, startDate: "2024-08-19", endDate: "2024-08-25" },
    { user: users.find(u => u.id === 12)!, startDate: "2024-12-02", endDate: "2024-12-08" },
  
    { user: users.find(u => u.id === 13)!, startDate: "2024-02-26", endDate: "2024-03-03" },
    { user: users.find(u => u.id === 13)!, startDate: "2024-07-29", endDate: "2024-08-04" },
    { user: users.find(u => u.id === 13)!, startDate: "2024-10-07", endDate: "2024-10-13" },
  
    { user: users.find(u => u.id === 14)!, startDate: "2024-03-11", endDate: "2024-03-17" },
    { user: users.find(u => u.id === 14)!, startDate: "2024-07-01", endDate: "2024-07-07" },
    { user: users.find(u => u.id === 14)!, startDate: "2024-10-14", endDate: "2024-10-20" },
  
    { user: users.find(u => u.id === 15)!, startDate: "2024-02-19", endDate: "2024-02-25" },
    { user: users.find(u => u.id === 15)!, startDate: "2024-08-12", endDate: "2024-08-18" },
    { user: users.find(u => u.id === 15)!, startDate: "2024-11-18", endDate: "2024-11-24" },
  
    { user: users.find(u => u.id === 16)!, startDate: "2024-01-15", endDate: "2024-01-21" },
    { user: users.find(u => u.id === 16)!, startDate: "2024-06-17", endDate: "2024-06-23" },
    { user: users.find(u => u.id === 16)!, startDate: "2024-10-21", endDate: "2024-10-27" },
  
    { user: users.find(u => u.id === 17)!, startDate: "2024-05-06", endDate: "2024-05-12" },
    { user: users.find(u => u.id === 17)!, startDate: "2024-09-30", endDate: "2024-10-06" },
    { user: users.find(u => u.id === 17)!, startDate: "2024-11-25", endDate: "2024-12-01" },
  
    { user: users.find(u => u.id === 18)!, startDate: "2024-04-01", endDate: "2024-04-07" },
    { user: users.find(u => u.id === 18)!, startDate: "2024-08-19", endDate: "2024-08-25" },
    { user: users.find(u => u.id === 18)!, startDate: "2024-11-04", endDate: "2024-11-10" },
  
    { user: users.find(u => u.id === 19)!, startDate: "2024-03-04", endDate: "2024-03-10" },
    { user: users.find(u => u.id === 19)!, startDate: "2024-07-15", endDate: "2024-07-21" },
    { user: users.find(u => u.id === 19)!, startDate: "2024-10-28", endDate: "2024-11-03" },
  
    { user: users.find(u => u.id === 20)!, startDate: "2024-02-12", endDate: "2024-02-18" },
    { user: users.find(u => u.id === 20)!, startDate: "2024-09-16", endDate: "2024-09-22" },
    { user: users.find(u => u.id === 20)!, startDate: "2024-11-11", endDate: "2024-11-17" },
  
    { user: users.find(u => u.id === 21)!, startDate: "2024-01-29", endDate: "2024-02-04" },
    { user: users.find(u => u.id === 21)!, startDate: "2024-08-05", endDate: "2024-08-11" },
    { user: users.find(u => u.id === 21)!, startDate: "2024-10-14", endDate: "2024-10-20" },
  
    { user: users.find(u => u.id === 22)!, startDate: "2024-03-25", endDate: "2024-03-31" },
    { user: users.find(u => u.id === 22)!, startDate: "2024-08-12", endDate: "2024-08-18" },
    { user: users.find(u => u.id === 22)!, startDate: "2024-12-09", endDate: "2024-12-15" },
  
    { user: users.find(u => u.id === 23)!, startDate: "2024-04-08", endDate: "2024-04-14" },
    { user: users.find(u => u.id === 23)!, startDate: "2024-07-29", endDate: "2024-08-04" },
    { user: users.find(u => u.id === 23)!, startDate: "2024-11-18", endDate: "2024-11-24" },
  
    { user: users.find(u => u.id === 24)!, startDate: "2024-05-13", endDate: "2024-05-19" },
    { user: users.find(u => u.id === 24)!, startDate: "2024-08-26", endDate: "2024-09-01" },
    { user: users.find(u => u.id === 24)!, startDate: "2024-12-02", endDate: "2024-12-08" },
  
    { user: users.find(u => u.id === 25)!, startDate: "2024-06-10", endDate: "2024-06-16" },
    { user: users.find(u => u.id === 25)!, startDate: "2024-07-22", endDate: "2024-07-28" },
    { user: users.find(u => u.id === 25)!, startDate: "2024-10-07", endDate: "2024-10-13" },
  
    { user: users.find(u => u.id === 26)!, startDate: "2024-01-15", endDate: "2024-01-21" },
    { user: users.find(u => u.id === 26)!, startDate: "2024-06-17", endDate: "2024-06-23" },
    { user: users.find(u => u.id === 26)!, startDate: "2024-10-21", endDate: "2024-10-27" },

    { user: users.find(u => u.id === 27)!, startDate: "2024-01-22", endDate: "2024-01-28" },
    { user: users.find(u => u.id === 27)!, startDate: "2024-06-24", endDate: "2024-06-30" },
    { user: users.find(u => u.id === 27)!, startDate: "2024-11-25", endDate: "2024-12-01" },

    { user: users.find(u => u.id === 28)!, startDate: "2024-01-29", endDate: "2024-02-04" },
    { user: users.find(u => u.id === 28)!, startDate: "2024-07-08", endDate: "2024-07-14" },
    { user: users.find(u => u.id === 28)!, startDate: "2024-11-04", endDate: "2024-11-10" },

    { user: users.find(u => u.id === 29)!, startDate: "2024-02-05", endDate: "2024-02-11" },
    { user: users.find(u => u.id === 29)!, startDate: "2024-07-15", endDate: "2024-07-21" },
    { user: users.find(u => u.id === 29)!, startDate: "2024-11-18", endDate: "2024-11-24" },

    { user: users.find(u => u.id === 30)!, startDate: "2024-02-12", endDate: "2024-02-18" },
    { user: users.find(u => u.id === 30)!, startDate: "2024-07-22", endDate: "2024-07-28" },
    { user: users.find(u => u.id === 30)!, startDate: "2024-12-02", endDate: "2024-12-08" },

    { user: users.find(u => u.id === 31)!, startDate: "2024-02-19", endDate: "2024-02-25" },
    { user: users.find(u => u.id === 31)!, startDate: "2024-07-29", endDate: "2024-08-04" },
    { user: users.find(u => u.id === 31)!, startDate: "2024-12-09", endDate: "2024-12-15" },

    { user: users.find(u => u.id === 32)!, startDate: "2024-03-04", endDate: "2024-03-10" },
    { user: users.find(u => u.id === 32)!, startDate: "2024-08-12", endDate: "2024-08-18" },
    { user: users.find(u => u.id === 32)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 33)!, startDate: "2024-03-11", endDate: "2024-03-17" },
    { user: users.find(u => u.id === 33)!, startDate: "2024-08-19", endDate: "2024-08-25" },
    { user: users.find(u => u.id === 33)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 34)!, startDate: "2024-03-18", endDate: "2024-03-24" },
    { user: users.find(u => u.id === 34)!, startDate: "2024-08-26", endDate: "2024-09-01" },
    { user: users.find(u => u.id === 34)!, startDate: "2024-11-25", endDate: "2024-12-01" },

    { user: users.find(u => u.id === 35)!, startDate: "2024-03-25", endDate: "2024-03-31" },
    { user: users.find(u => u.id === 35)!, startDate: "2024-09-02", endDate: "2024-09-08" },
    { user: users.find(u => u.id === 35)!, startDate: "2024-11-18", endDate: "2024-11-24" },

    { user: users.find(u => u.id === 36)!, startDate: "2024-04-01", endDate: "2024-04-07" },
    { user: users.find(u => u.id === 36)!, startDate: "2024-09-09", endDate: "2024-09-15" },
    { user: users.find(u => u.id === 36)!, startDate: "2024-11-04", endDate: "2024-11-10" },

    { user: users.find(u => u.id === 37)!, startDate: "2024-04-08", endDate: "2024-04-14" },
    { user: users.find(u => u.id === 37)!, startDate: "2024-09-16", endDate: "2024-09-22" },
    { user: users.find(u => u.id === 37)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 38)!, startDate: "2024-04-15", endDate: "2024-04-21" },
    { user: users.find(u => u.id === 38)!, startDate: "2024-09-23", endDate: "2024-09-29" },
    { user: users.find(u => u.id === 38)!, startDate: "2024-12-09", endDate: "2024-12-15" },

    { user: users.find(u => u.id === 39)!, startDate: "2024-04-22", endDate: "2024-04-28" },
    { user: users.find(u => u.id === 39)!, startDate: "2024-09-30", endDate: "2024-10-06" },
    { user: users.find(u => u.id === 39)!, startDate: "2024-11-25", endDate: "2024-12-01" },

    { user: users.find(u => u.id === 40)!, startDate: "2024-04-29", endDate: "2024-05-05" },
    { user: users.find(u => u.id === 40)!, startDate: "2024-10-07", endDate: "2024-10-13" },
    { user: users.find(u => u.id === 40)!, startDate: "2024-12-02", endDate: "2024-12-08" },

    { user: users.find(u => u.id === 41)!, startDate: "2024-05-06", endDate: "2024-05-12" },
    { user: users.find(u => u.id === 41)!, startDate: "2024-10-14", endDate: "2024-10-20" },
    { user: users.find(u => u.id === 41)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 42)!, startDate: "2024-05-13", endDate: "2024-05-19" },
    { user: users.find(u => u.id === 42)!, startDate: "2024-10-21", endDate: "2024-10-27" },
    { user: users.find(u => u.id === 42)!, startDate: "2024-11-18", endDate: "2024-11-24" },

    { user: users.find(u => u.id === 43)!, startDate: "2024-05-20", endDate: "2024-05-26" },
    { user: users.find(u => u.id === 43)!, startDate: "2024-10-28", endDate: "2024-11-03" },
    { user: users.find(u => u.id === 43)!, startDate: "2024-11-25", endDate: "2024-12-01" },

    { user: users.find(u => u.id === 44)!, startDate: "2024-05-27", endDate: "2024-06-02" },
    { user: users.find(u => u.id === 44)!, startDate: "2024-11-04", endDate: "2024-11-10" },
    { user: users.find(u => u.id === 44)!, startDate: "2024-12-09", endDate: "2024-12-15" },

    { user: users.find(u => u.id === 45)!, startDate: "2024-06-03", endDate: "2024-06-09" },
    { user: users.find(u => u.id === 45)!, startDate: "2024-11-11", endDate: "2024-11-17" },
    { user: users.find(u => u.id === 45)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 46)!, startDate: "2024-06-10", endDate: "2024-06-16" },
    { user: users.find(u => u.id === 46)!, startDate: "2024-11-18", endDate: "2024-11-24" },
    { user: users.find(u => u.id === 46)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 47)!, startDate: "2024-06-17", endDate: "2024-06-23" },
    { user: users.find(u => u.id === 47)!, startDate: "2024-11-25", endDate: "2024-12-01" },
    { user: users.find(u => u.id === 47)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 48)!, startDate: "2024-06-24", endDate: "2024-06-30" },
    { user: users.find(u => u.id === 48)!, startDate: "2024-12-02", endDate: "2024-12-08" },
    { user: users.find(u => u.id === 48)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 49)!, startDate: "2024-07-08", endDate: "2024-07-14" },
    { user: users.find(u => u.id === 49)!, startDate: "2024-12-09", endDate: "2024-12-15" },
    { user: users.find(u => u.id === 49)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 50)!, startDate: "2024-07-15", endDate: "2024-07-21" },
    { user: users.find(u => u.id === 50)!, startDate: "2024-12-02", endDate: "2024-12-08" },
    { user: users.find(u => u.id === 50)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 51)!, startDate: "2024-07-22", endDate: "2024-07-28" },
    { user: users.find(u => u.id === 51)!, startDate: "2024-11-25", endDate: "2024-12-01" },
    { user: users.find(u => u.id === 51)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 52)!, startDate: "2024-07-29", endDate: "2024-08-04" },
    { user: users.find(u => u.id === 52)!, startDate: "2024-12-16", endDate: "2024-12-22" },
    { user: users.find(u => u.id === 52)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 53)!, startDate: "2024-08-05", endDate: "2024-08-11" },
    { user: users.find(u => u.id === 53)!, startDate: "2024-12-09", endDate: "2024-12-15" },
    { user: users.find(u => u.id === 53)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 54)!, startDate: "2024-08-12", endDate: "2024-08-18" },
    { user: users.find(u => u.id === 54)!, startDate: "2024-12-16", endDate: "2024-12-22" },
    { user: users.find(u => u.id === 54)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 55)!, startDate: "2024-08-19", endDate: "2024-08-25" },
    { user: users.find(u => u.id === 55)!, startDate: "2024-12-09", endDate: "2024-12-15" },
    { user: users.find(u => u.id === 55)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 56)!, startDate: "2024-08-26", endDate: "2024-09-01" },
    { user: users.find(u => u.id === 56)!, startDate: "2024-12-16", endDate: "2024-12-22" },
    { user: users.find(u => u.id === 56)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 57)!, startDate: "2024-09-02", endDate: "2024-09-08" },
    { user: users.find(u => u.id === 57)!, startDate: "2024-12-02", endDate: "2024-12-08" },
    { user: users.find(u => u.id === 57)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 58)!, startDate: "2024-09-09", endDate: "2024-09-15" },
    { user: users.find(u => u.id === 58)!, startDate: "2024-12-09", endDate: "2024-12-15" },
    { user: users.find(u => u.id === 58)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 59)!, startDate: "2024-09-16", endDate: "2024-09-22" },
    { user: users.find(u => u.id === 59)!, startDate: "2024-12-02", endDate: "2024-12-08" },
    { user: users.find(u => u.id === 59)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 60)!, startDate: "2024-09-23", endDate: "2024-09-29" },
    { user: users.find(u => u.id === 60)!, startDate: "2024-12-16", endDate: "2024-12-22" },
    { user: users.find(u => u.id === 60)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 61)!, startDate: "2024-09-30", endDate: "2024-10-06" },
    { user: users.find(u => u.id === 61)!, startDate: "2024-12-02", endDate: "2024-12-08" },
    { user: users.find(u => u.id === 61)!, startDate: "2024-12-16", endDate: "2024-12-22" },

    { user: users.find(u => u.id === 62)!, startDate: "2024-10-07", endDate: "2024-10-13" },
    { user: users.find(u => u.id === 62)!, startDate: "2024-12-09", endDate: "2024-12-15" },
    { user: users.find(u => u.id === 62)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 63)!, startDate: "2024-10-14", endDate: "2024-10-20" },
    { user: users.find(u => u.id === 63)!, startDate: "2024-12-16", endDate: "2024-12-22" },
    { user: users.find(u => u.id === 63)!, startDate: "2024-12-23", endDate: "2024-12-29" },

    { user: users.find(u => u.id === 64)!, startDate: "2024-10-21", endDate: "2024-10-27" },
    { user: users.find(u => u.id === 64)!, startDate: "2024-12-02", endDate: "2024-12-08" },
    { user: users.find(u => u.id === 64)!, startDate: "2024-12-23", endDate: "2024-12-29" }
  ];

  export { vacations };