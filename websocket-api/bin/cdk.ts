#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { WebsocketApiStack } from "../lib/websocket-api-stack";

const app = new cdk.App();
new WebsocketApiStack(app, "WebsocketApiStack", {});
