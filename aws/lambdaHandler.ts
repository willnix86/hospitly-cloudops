import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createNewTenant, deleteTenant } from '../services/tenantService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const action = event.queryStringParameters?.action;
        if (action === 'createTenant') {
            const { hospitalName, contactName, contactEmail } = JSON.parse(event.body || '{}');
            const accountId = await createNewTenant(hospitalName, contactName, contactEmail, '', '');
            return {
                statusCode: 200,
                body: JSON.stringify({ message: `New hospital account created with ID: ${accountId}` })
            };
        } else if (action === 'deleteTenant') {
            const { hospitalId, dbName } = JSON.parse(event.body || '{}');
            await deleteTenant(hospitalId, dbName);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Tenant deleted successfully.' })
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Invalid action.' })
            };
        }
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Error: ${(err as Error).message}` })
        };
    }
};