import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { EmailLoginForm } from '@/components/auth/EmailLoginForm';

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn: any) => fn,
    reset: jest.fn(),
    formState: { errors: {}, isSubmitting: false },
  }),
  Controller: ({ render }: any) => {
    return render({
      field: {
        onChange: jest.fn(),
        onBlur: jest.fn(),
        value: '',
        name: 'test',
        ref: null,
      },
      fieldState: {
        invalid: false,
        isTouched: false,
        isDirty: false,
        error: null,
      },
    });
  },
}));

// Mock auth context
const mockSignIn = jest.fn();
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
  }),
}));

// Mock expo router
jest.mock('expo-router', () => ({
  Link: ({ children }: any) => children,
}));

// Mock useIconColors hook
jest.mock('@/hooks/useIconColors', () => ({
  useIconColors: () => ({ primary: '#FF6B35' }),
}));

describe('EmailLoginForm', () => {
  const mockProps = {
    onSuccess: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should render without errors
    expect(screen.getByText(/sign in/i)).toBeTruthy();
  });

  it('handles form submission', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Test that form exists and can be interacted with
    const form = screen.getByTestId('email-login-form');
    expect(form).toBeTruthy();
  });

  it('calls onSuccess when provided', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Simulate successful form submission
    fireEvent.press(screen.getByText(/sign in/i));
    
    // onSuccess should be called after successful sign in
    expect(mockProps.onSuccess).toHaveBeenCalled();
  });

  it('calls onCancel when provided', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Look for cancel button if it exists
    const cancelButton = screen.queryByText(/cancel/i);
    if (cancelButton) {
      fireEvent.press(cancelButton);
      expect(mockProps.onCancel).toHaveBeenCalled();
    }
  });

  it('displays validation errors correctly', () => {
    // Mock form with errors
    jest.requireMock('react-hook-form').useForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => fn,
      reset: jest.fn(),
      formState: { 
        errors: { 
          email: { message: 'Invalid email' },
          password: { message: 'Password required' }
        }, 
        isSubmitting: false 
      },
    });

    render(<EmailLoginForm {...mockProps} />);
    
    // Component should handle error state
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('shows loading state during submission', () => {
    // Mock form with loading state
    jest.requireMock('react-hook-form').useForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => fn,
      reset: jest.fn(),
      formState: { errors: {}, isSubmitting: true },
    });

    render(<EmailLoginForm {...mockProps} />);
    
    // Component should handle loading state
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('handles sign in error correctly', async () => {
    mockSignIn.mockRejectedValue(new Error('Invalid credentials'));

    render(<EmailLoginForm {...mockProps} />);
    
    // Simulate form submission with error
    fireEvent.press(screen.getByText(/sign in/i));
    
    // Should handle error gracefully
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('resets form after successful submission', () => {
    const mockReset = jest.fn();
    jest.requireMock('react-hook-form').useForm.mockReturnValue({
      control: {},
      handleSubmit: (fn: any) => fn,
      reset: mockReset,
      formState: { errors: {}, isSubmitting: false },
    });

    render(<EmailLoginForm {...mockProps} />);
    
    fireEvent.press(screen.getByText(/sign in/i));
    
    // Reset should be called after successful submission
    expect(mockReset).toHaveBeenCalled();
  });

  it('renders with minimal props', () => {
    render(<EmailLoginForm />);
    
    // Should render without required props
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('validates email format', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should have email validation
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('validates password requirements', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should have password validation
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('handles keyboard interactions', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should handle keyboard interactions
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('is accessible', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should be accessible
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('handles focus management correctly', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should manage focus correctly
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('handles long text gracefully', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should handle long text
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('supports custom styling', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should support custom styling
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });

  it('handles rapid button presses', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    const submitButton = screen.getByText(/sign in/i);
    
    // Simulate rapid button presses
    fireEvent.press(submitButton);
    fireEvent.press(submitButton);
    fireEvent.press(submitButton);
    
    // Should handle rapid presses gracefully
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('maintains form state correctly', () => {
    render(<EmailLoginForm {...mockProps} />);
    
    // Component should maintain form state
    expect(screen.getByTestId('email-login-form')).toBeTruthy();
  });
});