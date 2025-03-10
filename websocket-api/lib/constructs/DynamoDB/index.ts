import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

export class DynamoDB extends Construct {
  public readonly connectionTable: cdk.aws_dynamodb.TableV2;
  public readonly roomTable: cdk.aws_dynamodb.TableV2;
  public readonly chatMessageTable: cdk.aws_dynamodb.TableV2;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const stack = cdk.Stack.of(this);

    this.connectionTable = new cdk.aws_dynamodb.TableV2(
      this,
      "ConnectionTable",
      {
        tableName: `${stack.stackName}-ConnectionTable`,
        partitionKey: {
          name: "client_id",
          type: cdk.aws_dynamodb.AttributeType.STRING,
        },
        tags: [{ key: "stack", value: stack.stackName }],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        deletionProtection: false,
        timeToLiveAttribute: "expire_at",
      }
    );

    this.roomTable = new cdk.aws_dynamodb.TableV2(this, "RoomTable", {
      tableName: `${stack.stackName}-RoomTable`,
      partitionKey: {
        name: "room_id",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "client_id",
        type: cdk.aws_dynamodb.AttributeType.STRING,
      },
      tags: [{ key: "stack", value: stack.stackName }],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      deletionProtection: false,
    });

    this.chatMessageTable = new cdk.aws_dynamodb.TableV2(
      this,
      "ChatMessageTable",
      {
        tableName: `${stack.stackName}-ChatMessageTable`,
        partitionKey: {
          name: "room_id",
          type: cdk.aws_dynamodb.AttributeType.STRING,
        },
        sortKey: {
          name: "client_id",
          type: cdk.aws_dynamodb.AttributeType.STRING,
        },
        timeToLiveAttribute: "expire_at",
        tags: [{ key: "stack", value: stack.stackName }],
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        deletionProtection: false,
      }
    );
  }

  grantReadWriteData(grantable: cdk.aws_iam.IGrantable) {
    this.connectionTable.grantReadWriteData(grantable);
    this.roomTable.grantReadWriteData(grantable);
    this.chatMessageTable.grantReadWriteData(grantable);
  }
}
