import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";

type Props = {
  connectionLambda: cdk.aws_lambda.IFunction;
  customEventLambda: cdk.aws_lambda.IFunction;
};

export class APIGateway extends Construct {
  public readonly webSocketApi: cdk.aws_apigatewayv2.WebSocketApi;
  public readonly webSocketApiStage: cdk.aws_apigatewayv2.WebSocketStage;

  constructor(scope: Construct, id: string, props: Props) {
    super(scope, id);

    this.webSocketApi = new cdk.aws_apigatewayv2.WebSocketApi(
      this,
      "WebSocketApi",
      {
        apiName: "WebSocketExample",
        routeSelectionExpression: "$request.body.action",
        connectRouteOptions: {
          integration:
            new cdk.aws_apigatewayv2_integrations.WebSocketLambdaIntegration(
              "WebsocketLambdaIntegrationConnect",
              props.connectionLambda
            ),
          returnResponse: true,
        },
        disconnectRouteOptions: {
          integration:
            new cdk.aws_apigatewayv2_integrations.WebSocketLambdaIntegration(
              "WebsocketLambdaIntegrationDisconnect",
              props.connectionLambda
            ),
        },
        defaultRouteOptions: {
          integration:
            new cdk.aws_apigatewayv2_integrations.WebSocketLambdaIntegration(
              "WebsocketLambdaIntegrationDefault",
              props.connectionLambda
            ),
          returnResponse: true,
        },
      }
    );
    this.webSocketApi.addRoute("custom_event", {
      integration:
        new cdk.aws_apigatewayv2_integrations.WebSocketLambdaIntegration(
          "WebsocketLambdaIntegrationCustom",
          props.customEventLambda
        ),
      returnResponse: true,
    });

    this.webSocketApiStage = new cdk.aws_apigatewayv2.WebSocketStage(
      this,
      "WebSocketStage",
      {
        webSocketApi: this.webSocketApi,
        stageName: "prod",
        autoDeploy: true,
      }
    );
  }
}
