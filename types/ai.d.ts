/**
 * AI Chat related type definitions
 */

import { WithTimingConfig } from 'react-native-reanimated';

// Chat message structure
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

// Chat state
export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isThinking: boolean;
  error?: string;
}

// API request/response types
export interface ChatRequest {
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }[];
}

export interface ChatResponse {
  id: string;
  content: string;
  role: 'assistant';
}

// Removed unused theme types

// Prompt types
export interface PromptItem {
  id: string;
  title: string;
  content: string;
  category: string;
  icon?: string;
}

export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  prompts: PromptItem[];
}

// Animation types
export interface AnimationConfig extends WithTimingConfig {
  duration?: number;
}

export interface ThinkingAnimationProps {
  isVisible: boolean;
  size?: number;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  onPress?: () => void;
}

// Chat hook return type
export interface UseChatReturn {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  isThinking: boolean;
  error?: string;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
  setInput: (input: string) => void;
  resetChat: () => void;
}

// Removed unused component style and carousel types 