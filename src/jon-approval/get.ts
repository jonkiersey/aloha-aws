import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const documentClient = DynamoDBDocumentClient.from(client);

const getCommand = new GetCommand({
  Key: {
    id: 'main-like-counter',
  },
  TableName: process.env.COUNTERTABLE_TABLE_NAME,
  ConsistentRead: true,
});

const get = async (): Promise<number | null> => {
  console.log('getCommand', getCommand);
  const row = await documentClient.send(getCommand);
  console.log('row', row);
  return row.Item?.count != undefined ? row.Item.count : null;
};

export default get;
