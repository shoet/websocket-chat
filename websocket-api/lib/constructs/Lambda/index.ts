import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import path = require("path");

type Props = {
  connection_table_name: string;
  room_table_name: string;
  chat_message_table_name: string;
};

export class Lambda extends Construct {
  public readonly connectionLambdaFunction: cdk.aws_lambda.Function;
  public readonly customEventLambdaFunction: cdk.aws_lambda.Function;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.connectionLambdaFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      scope,
      "ConnectionLambdaFunction",
      {
        entry: path.join(__dirname, "code/connection/index.ts"),
        handler: "connectionHandler",
        runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
        environment: {
          CONNECTION_TABLE_NAME: props.connection_table_name,
          ROOM_TABLE_NAME: props.room_table_name,
          CHAT_MESSAGE_TABLE_NAME: props.chat_message_table_name,
        },
      }
    );

    this.customEventLambdaFunction = new cdk.aws_lambda_nodejs.NodejsFunction(
      scope,
      "CustomEventLambdaFunction",
      {
        entry: path.join(__dirname, "code/connection/index.ts"),
        handler: "customEventHandler",
        runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
        timeout: cdk.Duration.seconds(5),
        environment: {
          CONNECTION_TABLE_NAME: props.connection_table_name,
          ROOM_TABLE_NAME: props.room_table_name,
          CHAT_MESSAGE_TABLE_NAME: props.chat_message_table_name,
        },
      }
    );
  }
}
