'use client'

import { useState } from 'react';
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  confirmSignUp
} from 'aws-amplify/auth';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email, name }
        }
      });

      // Sign out the user immediately after signup to prevent auto-login
      // User should only be logged in after email verification
      await signOut();

    } catch (err: any) {
      // Check if user already exists
      if (err.name === 'UsernameExistsException') {
        throw new Error('USER_EXISTS');
      }
      throw new Error(err instanceof Error ? err.message : String('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmSignUp = async (email: string, code: string) => {
    setIsLoading(true);

    try {
      await confirmSignUp({ username: email, confirmationCode: code });

    } catch (err) {

      throw new Error(err instanceof Error ? err.message : String('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {

      await signIn({ username: email, password });

    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();

    } catch (err) {
      throw new Error(err instanceof Error ? err.message : String('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async () => {
    try {
      const user = await getCurrentUser();
      return user;
    } catch {
      return null;
    }
  };

  const getSession = async () => {
    try {
      const session = await fetchAuthSession();
      return session;
    } catch {
      return null;
    }
  };

  return {
    handleSignUp,
    handleConfirmSignUp,
    handleSignIn,
    handleSignOut,
    getUser,
    getSession,
    isLoading
  };
}