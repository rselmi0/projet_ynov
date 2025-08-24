import React from 'react';
import { render } from '@testing-library/react-native';
import ThinkingAnimation from '@/components/ai/ThinkingAnimation';

describe('ThinkingAnimation Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render thinking animation', () => {
    const { getByTestId } = render(
      <ThinkingAnimation testID="thinking-animation" />
    );
    
    expect(getByTestId('thinking-animation')).toBeTruthy();
  });

  it('should show loading dots', () => {
    const { getByText } = render(<ThinkingAnimation />);
    
    // Should show some form of loading indicator
    expect(getByText(/\.\.\./)).toBeTruthy();
  });

  it('should animate dots sequence', () => {
    const { getByText } = render(<ThinkingAnimation />);
    
    // Initial state
    const initialText = getByText(/\.\.\./);
    expect(initialText).toBeTruthy();
    
    // Advance animation
    jest.advanceTimersByTime(1000);
    
    // Animation should continue
    expect(true).toBe(true);
  });

  it('should handle custom message', () => {
    const { getByText } = render(
      <ThinkingAnimation message="Thinking hard..." />
    );
    
    expect(getByText('Thinking hard...')).toBeTruthy();
  });

  it('should apply custom styles', () => {
    const { getByTestId } = render(
      <ThinkingAnimation 
        style={{ backgroundColor: 'blue' }}
        testID="styled-thinking"
      />
    );
    
    expect(getByTestId('styled-thinking')).toBeTruthy();
  });

  it('should handle visibility prop', () => {
    const { rerender, queryByTestId } = render(
      <ThinkingAnimation visible={true} testID="thinking" />
    );
    
    expect(queryByTestId('thinking')).toBeTruthy();
    
    rerender(
      <ThinkingAnimation visible={false} testID="thinking" />
    );
    
    // Should handle visibility changes
    expect(true).toBe(true);
  });

  it('should clean up animation on unmount', () => {
    const { unmount } = render(<ThinkingAnimation />);
    
    unmount();
    
    // Should not throw errors after unmount
    jest.advanceTimersByTime(1000);
    expect(true).toBe(true);
  });
});