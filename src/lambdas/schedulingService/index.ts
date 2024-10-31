import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getCallScheduleData, getUserSchedule } from '../../services/scheduling/scheduleService';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { action, userId, department, date, hospitalName } = JSON.parse(event.body || '{}');

    console.log("EVENT BODY", event.body);

    const dateObject = new Date(date);
    const month = dateObject.getMonth() + 1; // getMonth() returns 0-11, so we add 1
    const year = dateObject.getFullYear();
    
    switch (action) {
        case 'getUserSchedule':
            const userSchedule = await getUserSchedule(hospitalName, userId, month, year, department);

            return {
                statusCode: 200,
                body: JSON.stringify(userSchedule)
            };
        case 'getCallSchedule':
            const callSchedule = await getCallScheduleData(hospitalName, month, year, department);
            return {
                statusCode: 200,
                body: JSON.stringify(callSchedule ?? {})
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