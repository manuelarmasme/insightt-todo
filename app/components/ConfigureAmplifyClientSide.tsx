"use client";

import { Amplify } from "aws-amplify";
import type { ResourcesConfig } from "aws-amplify";

// Manual Amplify configuration using environment variables
// This allows deployment on Vercel or any platform without amplify_outputs.json
const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID as string,
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID as string,
      identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID as string,
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
};

Amplify.configure(amplifyConfig, { ssr: true });

export default function ConfigureAmplifyClientSide() {
  return null;
}
