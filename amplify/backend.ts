import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { PolicyStatement } from "aws-cdk-lib/aws-iam";

const awsRegion = "eu-central-1";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  `https://bedrock-runtime.${awsRegion}.amazonaws.com`,
  {
    authorizationConfig: {
      signingRegion: awsRegion,
      signingServiceName: "bedrock",
    },
  }
)

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:${awsRegion}::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0`,
    ],
    actions: ["bedrock:InvokeModel"],
    
  })
)