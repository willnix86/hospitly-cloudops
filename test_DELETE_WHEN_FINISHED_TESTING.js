// test/createTenantTest.js
const { getTenantDb } = require('./services/tenantService.js');
const { createNewTenant } = require('./services/tenantService.js');
const { addUsersToTenant } = require('./services/userService.js');
const { users } = require('./testing/mocks/UserMocks.js');

const main = async (hospitalName) => {
    try {
//         const accountId = await createNewTenant('MUSC Health University Medical Center', 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
//         console.log(`Test tenant created with account ID: ${accountId}`);
        // const tenantDb = await getTenantDb(hospitalName);
        await addUsersToTenant(hospitalName, users);
        console.log('All users added successfully.');
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        process.exit();
    }
};

main('MUSC Health University Medical Center');