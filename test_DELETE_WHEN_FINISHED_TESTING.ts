// test/createTenantTest.ts
import { getTenantDb } from './db/db';

import { generateSchedule } from './services/scheduling/scheduleService';
import { Department } from './models';
import { departments, users } from './testing/mocks/UserMocks';
import { vacations } from './testing/mocks/VacationsMocks';
import { createOnCallTable } from './testing/helpers/createOnCallTable';

const main = async (hospitalName: string) => {
    const plastics: Department = departments.find((department) => department.id == 33)!;

    try {
        // // create a new tenant
        // const accountId = await createNewTenant('MUSC Health University Medical Center', 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
        // console.log(`Test tenant created with account ID: ${accountId}`);

        // // add users to the tenant
        // await addUsersToTenant(hospitalName, users);
        // console.log('All users added successfully.');

        // generate a schedule for the tenant
        const octoberSchedule = await generateSchedule(hospitalName, 10, 2024, plastics);
        // console.log(octoberSchedule);

        // console.log('October schedule generated:', octoberSchedule);

        const novemberSchedule = await generateSchedule(hospitalName, 11, 2024, plastics, octoberSchedule);
        // console.log(novemberSchedule);

        // console.log('November schedule generated:', novemberSchedule);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
};

main('MUSC Health University Medical Center');
