import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda"

const s3 = new S3Client({})
const dynamodb = new DynamoDBClient({})
const sqs = new SQSClient({})

// POST /orders saves the order, queues a job for it, and answers with the order id.
// GET /uploads/{key} reads a file from the bucket.
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (event.requestContext.http.method === "GET" && event.rawPath.startsWith("/uploads/")) {
    const object = await s3.send(
      new GetObjectCommand({ Bucket: process.env.BUCKET, Key: event.rawPath.slice("/uploads/".length) }),
    )
    return { statusCode: 200, body: (await object.Body?.transformToString()) ?? "" }
  }

  const orderId = crypto.randomUUID()
  await dynamodb.send(
    new PutItemCommand({ TableName: process.env.TABLE, Item: { orderId: { S: orderId } } }),
  )
  await sqs.send(new SendMessageCommand({ QueueUrl: process.env.QUEUE_URL, MessageBody: orderId }))
  return { statusCode: 201, body: JSON.stringify({ orderId }) }
}
