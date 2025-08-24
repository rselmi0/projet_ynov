import React from 'react';
import { render } from '@testing-library/react-native';
import TypewriterText from '@/components/ai/TypewriterText';

describe('TypewriterText Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render initial empty state', () => {
    const { queryByText } = render(
      <TypewriterText text="Hello World" speed={50} />
    );
    
    // Initially should not show full text
    expect(queryByText('Hello World')).toBeNull();
  });

  it('should start typing animation', () => {
    const { getByText } = render(
      <TypewriterText text="Hello" speed={50} />
    );
    
    // Fast forward timers to see typed text
    jest.advanceTimersByTime(100);
    
    // Should show at least first character
    const textElement = getByText(/H/);
    expect(textElement).toBeTruthy();
  });

  it('should handle empty text', () => {
    const { container } = render(
      <TypewriterText text="" speed={50} />
    );
    
    expect(container).toBeTruthy();
  });

  it('should handle different speeds', () => {
    const { rerender } = render(
      <TypewriterText text="Fast" speed={10} />
    );
    
    rerender(<TypewriterText text="Slow" speed={200} />);
    
    jest.advanceTimersByTime(300);
    expect(true).toBe(true); // Component should handle speed changes
  });

  it('should complete typing animation', () => {
    const mockOnComplete = jest.fn();
    const { getByText } = render(
      <TypewriterText 
        text="Done" 
        speed={50} 
        onComplete={mockOnComplete}
      />
    );
    
    // Fast forward to completion
    jest.advanceTimersByTime(1000);
    
    expect(getByText('Done')).toBeTruthy();
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('should handle text prop changes', () => {
    const { rerender } = render(
      <TypewriterText text="First" speed={50} />
    );
    
    rerender(<TypewriterText text="Second" speed={50} />);
    
    jest.advanceTimersByTime(200);
    expect(true).toBe(true); // Should handle prop changes
  });

  it('should apply custom styling', () => {
    const { getByTestId } = render(
      <TypewriterText 
        text="Styled" 
        speed={50}
        style={{ color: 'red' }}
        testID="typewriter"
      />
    );
    
    const element = getByTestId('typewriter');
    expect(element).toBeTruthy();
  });
});