import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getUserSchedule } from '../../services/scheduling/scheduleService';

function getPreviousMonth(month: number, year: number): { month: number, year: number } {
    if (month === 1) {
      return { month: 12, year: year - 1 };
    } else {
      return { month: month - 1, year };
    }
  }

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { action, userId, department, date, hospitalName } = JSON.parse(event.body || '{}');

    const dateObject = new Date(date);
    const month = dateObject.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const year = dateObject.getFullYear();
    const previousMonth = getPreviousMonth(month, year);
    
    switch (action) {
        case 'getUserSchedule':
            const schedule = await getUserSchedule(hospitalName, userId, month, year, department);

            return {
                statusCode: 200,
                body: JSON.stringify({ schedule })
            };
        case 'getCallSchedule':
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