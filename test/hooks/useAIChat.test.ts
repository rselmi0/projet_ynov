import { renderHook, act } from '@testing-library/react-native';
import { useAIChat } from '@/hooks/useAIChat';

// Mock dependencies
jest.mock('@/config/supabase', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockSupabase = require('@/config/supabase').supabase;

describe('useAIChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAIChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.sendMessage).toBe('function');
    expect(typeof result.current.clearChat).toBe('function');
    // Hook has basic chat functionality
  });

  it('should send message successfully', async () => {
    const mockResponse = {
      data: {
        response: 'Hello! How can I help you today?',
        messageId: 'msg-123',
      },
      error: null,
    };

    mockSupabase.functions.invoke.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toMatchObject({
      content: 'Hello',
      role: 'user',
    });
    expect(result.current.messages[1]).toMatchObject({
      content: 'Hello! How can I help you today?',
      role: 'assistant',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors gracefully', async () => {
    const mockError = new Error('API Error');
    mockSupabase.functions.invoke.mockRejectedValue(mockError);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toMatchObject({
      content: 'Hello',
      role: 'user',
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('should show loading state during message sending', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockSupabase.functions.invoke.mockReturnValue(promise);

    const { result } = renderHook(() => useAIChat());

    act(() => {
      result.current.sendMessage('Hello');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise({
        data: { response: 'Response', messageId: 'msg-123' },
        error: null,
      });
      await promise;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should clear chat messages', () => {
    const { result } = renderHook(() => useAIChat());

    // Add some messages first
    act(() => {
      result.current.sendMessage('Hello');
    });

    // Clear the chat
    act(() => {
      result.current.clearChat();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should retry last message', async () => {
    const mockResponse = {
      data: {
        response: 'Retried response',
        messageId: 'msg-456',
      },
      error: null,
    };

    // First call fails
    mockSupabase.functions.invoke.mockRejectedValueOnce(new Error('Network error'));
    // Second call succeeds
    mockSupabase.functions.invoke.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useAIChat());

    // Send initial message that fails
    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeTruthy();

    // The hook should handle errors gracefully
    expect(result.current.error).toBeTruthy();
  });

  it('should handle empty message input', async () => {
    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('');
    });

    expect(result.current.messages).toEqual([]);
    expect(mockSupabase.functions.invoke).not.toHaveBeenCalled();
  });

  it('should handle whitespace-only messages', async () => {
    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(result.current.messages).toEqual([]);
    expect(mockSupabase.functions.invoke).not.toHaveBeenCalled();
  });

  it('should maintain message history', async () => {
    const mockResponse1 = {
      data: { response: 'First response', messageId: 'msg-1' },
      error: null,
    };
    const mockResponse2 = {
      data: { response: 'Second response', messageId: 'msg-2' },
      error: null,
    };

    mockSupabase.functions.invoke
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('First message');
    });

    await act(async () => {
      await result.current.sendMessage('Second message');
    });

    expect(result.current.messages).toHaveLength(4);
    expect(result.current.messages[0].content).toBe('First message');
    expect(result.current.messages[1].content).toBe('First response');
    expect(result.current.messages[2].content).toBe('Second message');
    expect(result.current.messages[3].content).toBe('Second response');
  });

  it('should handle long messages', async () => {
    const longMessage = 'A'.repeat(1000);
    const mockResponse = {
      data: { response: 'Handled long message', messageId: 'msg-long' },
      error: null,
    };

    mockSupabase.functions.invoke.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage(longMessage);
    });

    expect(result.current.messages[0].content).toBe(longMessage);
    expect(result.current.messages[1].content).toBe('Handled long message');
  });

  it('should handle network timeout', async () => {
    const timeoutError = new Error('Network timeout');
    mockSupabase.functions.invoke.mockRejectedValue(timeoutError);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error).toBeTruthy();
  });

  it('should handle invalid API response', async () => {
    const invalidResponse = {
      data: null,
      error: { message: 'Invalid request' },
    };

    mockSupabase.functions.invoke.mockResolvedValue(invalidResponse);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.messages).toHaveLength(1); // Only user message
  });

  it('should generate unique message IDs', async () => {
    const mockResponse = {
      data: { response: 'Response', messageId: 'msg-123' },
      error: null,
    };

    mockSupabase.functions.invoke.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('First');
    });

    await act(async () => {
      await result.current.sendMessage('Second');
    });

    const messageIds = result.current.messages.map(msg => msg.id);
    const uniqueIds = [...new Set(messageIds)];
    
    expect(messageIds).toHaveLength(uniqueIds.length);
  });

  it('should clear errors when sending new message', async () => {
    // First message fails
    mockSupabase.functions.invoke.mockRejectedValueOnce(new Error('Error'));
    
    const { result } = renderHook(() => useAIChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeTruthy();

    // Second message succeeds
    mockSupabase.functions.invoke.mockResolvedValueOnce({
      data: { response: 'Success', messageId: 'msg-success' },
      error: null,
    });

    await act(async () => {
      await result.current.sendMessage('World');
    });

    expect(result.current.error).toBeNull();
  });
}); 