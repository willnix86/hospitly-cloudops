// test/createTenantTest.ts
const { getTenantDb } = require('./services/tenantService.ts');
const { createNewTenant } = require('./services/tenantService.ts');
const { addUsersToTenant } = require('./services/userService.ts');
const { generateSchedule } = require('./services/scheduling/scheduleService.ts');
const { users } = require('./testing/mocks/UserMocks.ts');

const main = async (hospitalName: string) => {
    try {
        // // create a new tenant
        // const accountId = await createNewTenant('MUSC Health University Medical Center', 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
        // console.log(`Test tenant created with account ID: ${accountId}`);

        // // add users to the tenant
        // await addUsersToTenant(hospitalName, users);
        // console.log('All users added successfully.');

        // generate a schedule for the tenant
        const octoberSchedule = await generateSchedule(hospitalName, 10, 2024, 33);
        // console.log('October schedule generated:', octoberSchedule);

        const novemberSchedule = await generateSchedule(hospitalName, 11, 2024, 33, octoberSchedule);
        console.log('November schedule generated:', novemberSchedule);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
};

main('MUSC Health University Medical Center');