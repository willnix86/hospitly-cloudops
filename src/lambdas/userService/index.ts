import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { addUserToTenant, addUsersToTenant } from '../../services/users/userService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { action, hospitalName } = event.queryStringParameters || {};
    const body = JSON.parse(event.body || '{}');

    switch (action) {
      case 'addUser':
        await addUserToTenant(hospitalName!, body.user);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'User added successfully' })
        };
      case 'addUsers':
        await addUsersToTenant(hospitalName!, body.users);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Users added successfully' })
        };
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid action' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error: ${(error as Error).message}` })
    };
  }
};