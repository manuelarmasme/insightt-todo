"use client";

import { Amplify } from "aws-amplify";

// Manual Amplify configuration using environment variables
// This allows deployment on Vercel or any platform without amplify_outputs.json
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || "us-east-2_ZL2lM5oZj",
      userPoolClientId:
        process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ||
        "6tjncv073cekve21q5mmitvmh3",
      identityPoolId:
        process.env.NEXT_PUBLIC_IDENTITY_POOL_ID ||
        "us-east-2:9f3f4d64-d23f-47c1-9914-0ffd5d42fe52",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code" as const,
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
