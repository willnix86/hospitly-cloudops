// scripts/createTenant.js
const { createNewTenant } = require('../services/tenantService');

(async () => {
    try {
        const accountId = await createNewTenant('General Hospital', 'Dr. John Doe', 'johndoe@generalhospital.com');
        console.log(`New hospital account created with ID: ${accountId}`);
    } catch (err) {
        console.error('Error creating new tenant:', err);
    }
})();