import * as z from 'zod';
import { Session } from '@supabase/supabase-js';

// Base interface for form validation
export interface AuthFormData {
  email: string;
  password: string;
}

// Sign up form data interface
export interface SignUpFormData extends AuthFormData {
  confirmPassword: string;
}

// Reset password form data interface
export interface ResetPasswordFormData {
  email: string;
}

// Social login provider types
export type SocialProvider = 'google' | 'apple' | 'facebook';

// Interface for social login button props
export interface SocialLoginButtonProps {
  provider: SocialProvider;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Interface for Apple provider button
export interface AppleProviderButtonProps {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Interface for Google provider button
export interface GoogleProviderButtonProps {
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

// Interface for email login form
export interface EmailLoginFormProps {
  mode: 'signIn' | 'signUp';
  onSubmit: (data: AuthFormData | SignUpFormData) => Promise<void>;
  loading?: boolean;
}

// Interface for email login toggle
export interface EmailLoginToggleProps {
  showForm: boolean;
  onToggle: (show: boolean) => void;
  onSuccess?: () => void;
}

// Interface for form field props
export interface AuthFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type?: 'email' | 'password' | 'text';
  autoComplete?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

// Authentication error types
export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// Authentication state types (generic)
export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  session: any | null;
  loading: boolean;
  error: AuthError | null;
}

// Authentication context state type (specific to the context implementation)
export interface AuthContextState {
  initialized: boolean;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Form validation schema types
export type SignInFormSchema = z.ZodObject<{
  email: z.ZodString;
  password: z.ZodString;
}>;

export type SignUpFormSchema = z.ZodObject<{
  email: z.ZodString;
  password: z.ZodString;
  confirmPassword: z.ZodString;
}>;

export type ResetPasswordFormSchema = z.ZodObject<{
  email: z.ZodString;
}>;

// Response types from authentication services
export interface AuthResponse {
  user?: any;
  session?: any;
  error?: AuthError;
}

// Interface for authentication context
export interface AuthContextType {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  state: AuthState;
} 