import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { generateWorkSchedule } from '../../services/scheduling/scheduleService';
import { Department } from '../../models';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { action, hospitalName } = event.queryStringParameters || {};
    const body = JSON.parse(event.body || '{}');

    switch (action) {
      case 'generateSchedule':
        const { month, year, departmentId, departmentName, previousMonthSchedule } = body;
        
        const department: Department = { id: departmentId, name: departmentName };
        
        const schedule = await generateWorkSchedule(
          hospitalName!,
          month,
          year,
          department,
          previousMonthSchedule || null
        );

        return {
          statusCode: 200,
          body: JSON.stringify({ schedule })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error in scheduling service:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Error: ${(error as Error).message}` })
    };
  }
};