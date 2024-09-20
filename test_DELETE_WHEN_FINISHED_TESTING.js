// test/createTenantTest.js
const { createNewTenant } = require('./src/services/tenantService');

const testCreateNewTenant = async () => {
    try {
        const accountId = await createNewTenant('Test Hospital', 'Dr. John Doe', 'johndoe@testhospital.com', 'testuser', 'testpassword');
        console.log(`Test tenant created with account ID: ${accountId}`);
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testCreateNewTenant();