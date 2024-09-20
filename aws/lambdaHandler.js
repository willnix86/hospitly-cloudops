// aws/lambdaHandler.js
const { createNewTenant, deleteTenant } = require('../src/services/tenantService');

exports.handler = async (event) => {
    try {
        const action = event.action;
        if (action === 'createTenant') {
            const { hospitalName, contactName, contactEmail } = event;
            const accountId = await createNewTenant(hospitalName, contactName, contactEmail);
            return {
                statusCode: 200,
                body: `New hospital account created with ID: ${accountId}`
            };
        } else if (action === 'deleteTenant') {
            const { hospitalId, dbName } = event;
            await deleteTenant(hospitalId, dbName);
            return {
                statusCode: 200,
                body: 'Tenant deleted successfully.'
            };
        } else {
            return {
                statusCode: 400,
                body: 'Invalid action.'
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: `Error: ${err.message}`
        };
    }
};