import { CognitoJwtVerifier } from 'aws-jwt-verify';

// Create a verifier instance for Cognito ID tokens
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.DATABASE_AWS_COGNITO_USER_POOL_ID!,
  tokenUse: 'id',
  clientId: process.env.DATABASE_AWS_COGNITO_CLIENT_ID!,
});

export interface AuthResult {
  authenticated: boolean;
  userId: string | null;
  email: string | null;
}

/**
 * Validates the JWT token from the Authorization header
 * @param request - The Next.js request object
 * @returns Authentication result with userId and email if valid
 */
export async function validateToken(request: Request): Promise<AuthResult> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return { authenticated: false, userId: null, email: null };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify the JWT token with AWS Cognito
    const payload = await verifier.verify(token);

    return {
      authenticated: true,
      userId: payload.sub, // Cognito user ID (sub claim)
      email: payload.email as string,
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return { authenticated: false, userId: null, email: null };
  }
}

/**
 * Middleware helper to extract and validate authentication
 * Throws an error if authentication fails
 */
export async function requireAuth(request: Request): Promise<{ userId: string; email: string | null }> {
  const auth = await validateToken(request);
  
  if (!auth.authenticated || !auth.userId) {
    throw new Error('Unauthorized');
  }
  
  return { userId: auth.userId, email: auth.email };
}
