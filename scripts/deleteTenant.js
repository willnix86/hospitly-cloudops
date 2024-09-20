// scripts/deleteTenant.js
const { deleteTenant } = require('../src/services/tenantService');

(async () => {
    try {
        const hospitalId = 1;  // Replace with the actual hospital ID
        const dbName = 'general_hospital_db';  // Replace with the actual DB name
        await deleteTenant(hospitalId, dbName);
        console.log('Tenant deleted successfully.');
    } catch (err) {
        console.error('Error deleting tenant:', err);
    }
})();