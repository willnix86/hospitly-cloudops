// test/createTenantTest.js
const { getTenantDb } = require('./services/tenantService.js');
const { createNewTenant } = require('./services/tenantService.js');
const { addUsersToTenant } = require('./services/userService.js');
const { generateSchedule } = require('./services/scheduleService.js');
const { users } = require('./testing/mocks/UserMocks.js');

const main = async (hospitalName: string) => {
    try {
        // create a new tenant
        // const accountId = await createNewTenant('MUSC Health University Medical Center', 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
        // console.log(`Test tenant created with account ID: ${accountId}`);
        // const tenantDb = await getTenantDb(hospitalName);

        // add users to the tenant
        // await addUsersToTenant(hospitalName, users);
        // console.log('All users added successfully.');

        // generate a schedule for the tenant
        const schedule = await generateSchedule(hospitalName, 10, 2024, 33);
        console.log('Final schedule generated:', schedule);

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
};

main('MUSC Health University Medical Center');