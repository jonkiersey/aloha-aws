import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { get, post } from './jon-approval';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          count: await get(),
        }),
      };
    }
    if (event.httpMethod === 'POST') {
      const count = event.body ? JSON.parse(event.body).count : undefined;
      return {
        statusCode: 200,
        body: JSON.stringify({
          count: await post(count),
        }),
      };
    }

    return {
      statusCode: 405,
      body: JSON.stringify({
        message: 'Method not allowed',
      }),
    };
  } catch (err) {
    let errorMessage = 'Internal server error';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: errorMessage,
      }),
    };
  }
};
