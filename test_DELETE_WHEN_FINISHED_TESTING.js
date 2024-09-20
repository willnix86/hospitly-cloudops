// test/createTenantTest.js
const { createNewTenant } = require('./services/tenantService.js');

const testCreateNewTenant = async () => {
    try {
        const accountId = await createNewTenant('MUSC Health University Medical Center', 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
        console.log(`Test tenant created with account ID: ${accountId}`);
        return accountId;
    } catch (error) {
        console.error('Test failed:', error);
        return;
    }
};

testCreateNewTenant();