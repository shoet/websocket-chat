import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Lambda, APIGateway, DynamoDB } from "./constructs";

export class WebsocketApiStack extends cdk.Stack {
  readonly dynamodb: DynamoDB;
  readonly lambda: Lambda;
  readonly apiGateway: APIGateway;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.dynamodb = new DynamoDB(this, "DynamoDB");

    this.lambda = new Lambda(this, "Lambda", {
      room_table_name: this.dynamodb.roomTable.tableName,
      connection_table_name: this.dynamodb.connectionTable.tableName,
      chat_message_table_name: this.dynamodb.chatMessageTable.tableName,
    });
    this.apiGateway = new APIGateway(this, "APIGateway", {
      connectionLambda: this.lambda.connectionLambdaFunction,
      customEventLambda: this.lambda.customEventLambdaFunction,
    });

    this.lambda.connectionLambdaFunction.addEnvironment(
      "CALLBACK_URL",
      this.apiGateway.webSocketApiStage.callbackUrl
    );
    this.lambda.customEventLambdaFunction.addEnvironment(
      "CALLBACK_URL",
      this.apiGateway.webSocketApiStage.callbackUrl
    );

    this.dynamodb.grantReadWriteData(this.lambda.connectionLambdaFunction);
    this.dynamodb.grantReadWriteData(this.lambda.customEventLambdaFunction);

    this.apiGateway.webSocketApi.grantManageConnections(
      this.lambda.connectionLambdaFunction
    );
    this.apiGateway.webSocketApi.grantManageConnections(
      this.lambda.customEventLambdaFunction
    );

    this.cfnOutput();
  }

  cfnOutput() {
    new cdk.CfnOutput(this, "ConnectionLambdaFunctionLogGroup", {
      value: this.lambda.connectionLambdaFunction.logGroup.logGroupName,
    });

    new cdk.CfnOutput(this, "CustomEventLambdaFunctionLogGroup", {
      value: this.lambda.customEventLambdaFunction.logGroup.logGroupName,
    });

    new cdk.CfnOutput(this, "APIGatewayEndpoint", {
      value: this.apiGateway.webSocketApi.apiEndpoint,
    });

    new cdk.CfnOutput(this, "APIGatewayStageURL", {
      value: this.apiGateway.webSocketApiStage.url,
    });

    new cdk.CfnOutput(this, "ConnectionTableName", {
      value: this.dynamodb.connectionTable.tableName,
    });

    new cdk.CfnOutput(this, "RoomTableName", {
      value: this.dynamodb.roomTable.tableName,
    });

    new cdk.CfnOutput(this, "ChatMessageTableName", {
      value: this.dynamodb.chatMessageTable.tableName,
    });
  }
}
