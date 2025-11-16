#!/usr/bin/env node
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import { AmplifyHostingStack } from '../lib/amplify-stack';
import { CognitoStack } from '../lib/cognito-stack';
import { BackendStack } from '../lib/backend-stack';
import { CloudWatchStack } from '../lib/cloudwatch-stack';

const app = new cdk.App();

const account = process.env.AWS_ACCOUNT || app.node.tryGetContext('account') || process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.AWS_REGION || app.node.tryGetContext('region') || process.env.CDK_DEFAULT_REGION;

const env = { account, region };

const cognitoStack = new CognitoStack(app, 'TodoAppCognitoStack', {
    env,
});

const backendStack = new BackendStack(app, 'TodoAppBackendStack', {
    env,
    userPoolArn: cognitoStack.userPoolArn.value
});

const amplifyStack = new AmplifyHostingStack(app, 'TodoAppAmplifyHostingStack', {
    env,
    userPoolId: cognitoStack.userPoolId.value,
    userPoolClientId: cognitoStack.userPoolClientId.value,
    identityPoolId: cognitoStack.identityPoolId.value,
    serverURL: backendStack.apiUrl.value
});

const cloudWatchStack = new CloudWatchStack(app, 'TodoAppCloudWatchStack', {
    env,
    amplifyAppId: amplifyStack.amplifyAppId.value,
    functionName: backendStack.lambdaFunctionName.value
});