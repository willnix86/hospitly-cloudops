// test/createTenantTest.ts
import { getTenantDb } from './db/db';

import { generateSchedule } from './services/scheduling/scheduleService';
import { createNewTenant } from './services/tenants/tenantService';
import { Department } from './models';
import { departments, users } from './testing/mocks/UserMocks';
import { vacations } from './testing/mocks/VacationsMocks';
import { createOnCallTable } from './testing/helpers/createOnCallTable';

const main = async (hospitalName: string) => {
    const plastics: Department = { id: 16, name: 'Plastics' };

    try {
        // create a new tenant
        // const accountId = await createNewTenant(hospitalName, 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
        // console.log(`Test tenant created with account ID: ${accountId}`);

        // // add users to the tenant
        // await addUsersToTenant(hospitalName, users);
        // console.log('All users added successfully.');

        // generate a schedule for the tenant
        const octoberSchedule = await generateSchedule(hospitalName, 10, 2024, plastics);
        // console.log(octoberSchedule);

        const novemberSchedule = await generateSchedule(hospitalName, 11, 2024, plastics, octoberSchedule);
        // console.log(novemberSchedule);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
};

main('MUSC Health University Medical Center');
