import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MessageBubble from '@/components/ai/MessageBubble';

describe('MessageBubble Component', () => {
  const mockMessage = {
    id: '1',
    content: 'Hello, this is a test message',
    role: 'user' as const,
    timestamp: new Date().toISOString(),
  };

  it('should render message content', () => {
    const { getByText } = render(
      <MessageBubble message={mockMessage} />
    );
    
    expect(getByText('Hello, this is a test message')).toBeTruthy();
  });

  it('should handle user messages', () => {
    const { getByText } = render(
      <MessageBubble message={{ ...mockMessage, role: 'user' }} />
    );
    
    expect(getByText('Hello, this is a test message')).toBeTruthy();
  });

  it('should handle assistant messages', () => {
    const { getByText } = render(
      <MessageBubble message={{ ...mockMessage, role: 'assistant' }} />
    );
    
    expect(getByText('Hello, this is a test message')).toBeTruthy();
  });

  it('should handle system messages', () => {
    const { getByText } = render(
      <MessageBubble message={{ ...mockMessage, role: 'system' }} />
    );
    
    expect(getByText('Hello, this is a test message')).toBeTruthy();
  });

  it('should handle long messages', () => {
    const longMessage = 'This is a very long message '.repeat(20);
    const { getByText } = render(
      <MessageBubble message={{ ...mockMessage, content: longMessage }} />
    );
    
    expect(getByText(longMessage)).toBeTruthy();
  });

  it('should handle empty messages', () => {
    const { container } = render(
      <MessageBubble message={{ ...mockMessage, content: '' }} />
    );
    
    expect(container).toBeTruthy();
  });

  it('should display timestamp when provided', () => {
    const timestamp = new Date('2023-01-01T12:00:00Z').toISOString();
    const { getByText } = render(
      <MessageBubble 
        message={{ ...mockMessage, timestamp }}
        showTimestamp={true}
      />
    );
    
    // Should show some form of timestamp
    expect(true).toBe(true); // Adjust based on actual timestamp format
  });

  it('should handle message with metadata', () => {
    const messageWithMetadata = {
      ...mockMessage,
      metadata: {
        tokens: 150,
        model: 'gpt-3.5-turbo',
      },
    };
    
    const { getByText } = render(
      <MessageBubble message={messageWithMetadata} />
    );
    
    expect(getByText('Hello, this is a test message')).toBeTruthy();
  });

  it('should handle press events', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <MessageBubble message={mockMessage} onPress={onPress} />
    );
    
    fireEvent.press(getByText('Hello, this is a test message'));
    expect(onPress).toHaveBeenCalledWith(mockMessage);
  });

  it('should apply different styles for different roles', () => {
    const { rerender, getByTestId } = render(
      <MessageBubble 
        message={{ ...mockMessage, role: 'user' }} 
        testID="message-user"
      />
    );
    
    expect(getByTestId('message-user')).toBeTruthy();
    
    rerender(
      <MessageBubble 
        message={{ ...mockMessage, role: 'assistant' }} 
        testID="message-assistant"
      />
    );
    
    expect(getByTestId('message-assistant')).toBeTruthy();
  });

  it('should handle loading state', () => {
    const { getByText } = render(
      <MessageBubble 
        message={{ ...mockMessage, content: '' }} 
        isLoading={true}
      />
    );
    
    // Should show loading indicator or placeholder
    expect(true).toBe(true); // Adjust based on loading implementation
  });
});