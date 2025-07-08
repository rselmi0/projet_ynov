import { useState, useCallback } from 'react';
import { ChatMessage, UseChatReturn } from '@/types/ai';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/config/supabase';

export const useAIChat = (): UseChatReturn & { latestAIMessageId: string | null } => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [latestAIMessageId, setLatestAIMessageId] = useState<string | null>(null);

  const sendMessage = useCallback(async (messageText: string) => {
    const trimmedMessage = messageText.trim();
    if (!trimmedMessage || isLoading) return;

    try {
      setIsLoading(true);
      setIsThinking(true);
      setError(undefined);

      // Add user message to chat
      const userMessage: ChatMessage = {
        id: Date.now().toString() + '-user',
        role: 'user',
        content: trimmedMessage,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      // Call Supabase Edge Function
      const { data, error: supabaseError } = await supabase.functions.invoke('ai-completion', {
        body: {
          prompt: trimmedMessage,
        },
      });

      if (supabaseError) {
        throw new Error(supabaseError.message || 'Failed to get AI response');
      }

      if (!data || !data.text) {
        throw new Error('Invalid response from AI service');
      }

      // Add AI response to chat
      const aiMessageId = Date.now().toString() + '-ai';
      const aiMessage: ChatMessage = {
        id: aiMessageId,
        role: 'assistant',
        content: data.text,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setLatestAIMessageId(aiMessageId);

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : t('ai.error');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsThinking(false);
    }
  }, [isLoading, t]);

  const handleInputChange = useCallback((text: string) => {
    setInput(text);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setLatestAIMessageId(null);
    setError(undefined);
  }, []);

  const resetChat = useCallback(() => {
    clearChat();
  }, [clearChat]);

  return {
    messages,
    input,
    isLoading,
    isThinking,
    error,
    sendMessage,
    clearChat,
    setInput: handleInputChange,
    resetChat,
    latestAIMessageId,
  };
};

 