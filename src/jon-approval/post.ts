import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

const post = async (count?: number): Promise<number> => {
  const updateCommand = new UpdateCommand({
    Key: {
      id: 'main-like-counter',
    },
    TableName: process.env.COUNTERTABLE_TABLE_NAME,
    UpdateExpression: 'SET #count = if_not_exists(#count, :start) + :incr',
    ExpressionAttributeNames: {
      '#count': 'count',
    },
    ExpressionAttributeValues: {
      ':start': 0,
      ':incr': count !== undefined ? count : 1,
    },
    ReturnValues: 'UPDATED_NEW',
  });
  const response = await documentClient.send(updateCommand);
  if (response.Attributes === undefined) {
    throw new Error('Failed to add approval');
  }
  return response.Attributes.count;
};

export default post;
