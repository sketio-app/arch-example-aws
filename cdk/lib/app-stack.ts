import * as cdk from "aws-cdk-lib"
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2"
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as sqs from "aws-cdk-lib/aws-sqs"
import type { Construct } from "constructs"

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const uploads = new s3.Bucket(this, "Uploads", { versioned: true })
    const orders = new dynamodb.Table(this, "Orders", {
      partitionKey: { name: "orderId", type: dynamodb.AttributeType.STRING },
    })
    const jobs = new sqs.Queue(this, "Jobs")

    const api = new lambda.Function(this, "Api", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset("dist/api"),
      environment: { TABLE: orders.tableName, QUEUE_URL: jobs.queueUrl, BUCKET: uploads.bucketName },
    })

    uploads.grantRead(api)
    orders.grantWriteData(api)
    jobs.grantSendMessages(api)

    new apigwv2.HttpApi(this, "Http", {
      defaultIntegration: new HttpLambdaIntegration("ApiIntegration", api),
    })
  }
}
