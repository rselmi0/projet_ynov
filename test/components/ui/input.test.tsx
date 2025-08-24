import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '@/components/ui/input';

describe('Input Component', () => {
  it('should render input correctly', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should handle text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Test input" onChangeText={mockOnChangeText} />
    );
    
    const input = getByPlaceholderText('Test input');
    fireEvent.changeText(input, 'Hello World');
    
    expect(mockOnChangeText).toHaveBeenCalledWith('Hello World');
  });

  it('should display default value', () => {
    const { getByDisplayValue } = render(
      <Input defaultValue="Initial text" />
    );
    expect(getByDisplayValue('Initial text')).toBeTruthy();
  });

  it('should handle controlled value', () => {
    const { getByDisplayValue } = render(
      <Input value="Controlled value" onChangeText={() => {}} />
    );
    expect(getByDisplayValue('Controlled value')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { getByPlaceholderText } = render(
      <Input className="custom-input" placeholder="Styled input" />
    );
    expect(getByPlaceholderText('Styled input')).toBeTruthy();
  });

  it('should be editable by default', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Editable input" />
    );
    const input = getByPlaceholderText('Editable input');
    expect(input.props.editable).not.toBe(false);
  });

  it('should handle non-editable state', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Non-editable" editable={false} />
    );
    const input = getByPlaceholderText('Non-editable');
    expect(input.props.editable).toBe(false);
  });
});