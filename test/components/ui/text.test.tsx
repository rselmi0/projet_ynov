import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '@/components/ui/text';

describe('Text Component', () => {
  it('should render text correctly', () => {
    const { getByText } = render(<Text>Hello World</Text>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { getByText } = render(
      <Text className="text-primary">Styled Text</Text>
    );
    expect(getByText('Styled Text')).toBeTruthy();
  });

  it('should handle custom styles', () => {
    const { getByText } = render(
      <Text style={{ fontSize: 20 }}>Large Text</Text>
    );
    expect(getByText('Large Text')).toBeTruthy();
  });
});