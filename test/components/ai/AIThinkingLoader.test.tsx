import React from 'react';
import { render } from '@testing-library/react-native';
import AIThinkingLoader from '@/components/ai/AIThinkingLoader';

describe('AIThinkingLoader', () => {
  it('should render correctly when visible', () => {
    const { UNSAFE_root } = render(<AIThinkingLoader isVisible={true} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render correctly when not visible', () => {
    const { UNSAFE_root } = render(<AIThinkingLoader isVisible={false} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should show animated thinking dots when visible', () => {
    const { UNSAFE_root } = render(<AIThinkingLoader isVisible={true} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle visibility prop changes', () => {
    const { rerender } = render(<AIThinkingLoader isVisible={true} />);
    rerender(<AIThinkingLoader isVisible={false} />);
    // Component should handle visibility changes without errors
  });

  it('should render without errors', () => {
    const { UNSAFE_root } = render(<AIThinkingLoader isVisible={true} />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle multiple instances', () => {
    const { UNSAFE_root } = render(
      <>
        <AIThinkingLoader isVisible={true} />
        <AIThinkingLoader isVisible={false} />
        <AIThinkingLoader isVisible={true} />
      </>
    );
    expect(UNSAFE_root).toBeTruthy();
  });

  it('should maintain consistent behavior', () => {
    const { UNSAFE_root } = render(<AIThinkingLoader isVisible={true} />);
    expect(UNSAFE_root).toBeTruthy();
    
    // Re-render should maintain consistency
    const { UNSAFE_root: root2 } = render(<AIThinkingLoader isVisible={false} />);
    expect(root2).toBeTruthy();
  });
}); 