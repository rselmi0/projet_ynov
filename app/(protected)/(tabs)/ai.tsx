import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn, 
  FadeInDown,
} from 'react-native-reanimated';
import { Bot, Sparkles } from 'lucide-react-native';

// AI Components and Data
import {
  ChatHeader,
  MessageBubble,
  PromptLabels,
  useAIChat,
  quickPrompts,
  AIThinkingLoader,
} from '@/components/ai';
import { PromptItem } from '@/types/ai';
import { useTranslation } from '@/hooks/useTranslation';
import AutoResizingInput from '@/components/ai/AutoResizingInput';
import { useIconColors } from '@/hooks/useIconColors';

export default function AIScreen() {
  const { t } = useTranslation();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const {
    messages,
    input,
    isLoading,
    isThinking,
    error,
    sendMessage,
    resetChat,
    setInput,
    latestAIMessageId,
  } = useAIChat();

  const hasMessages = messages.length > 0;
  const [showLabels, setShowLabels] = useState(true);

  const iconColors = useIconColors();

  const handleSend = async () => {
    // Hide labels with animation before sending first message
    if (!hasMessages && input.trim()) {
      // Wait for labels animation to complete before sending
      setTimeout(async () => {
        setShowLabels(false);
        await sendMessage(input);
      }, 800); // Duration matches labels animation (800ms)
    } else {
      await sendMessage(input);
    }
    
    // Auto-scroll to bottom after sending
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleInputChange = (text: string) => {
    setInput(text);
  };

  const handleSubmit = async () => {
    await handleSend();
  };

  const handlePromptSelect = (prompt: PromptItem) => {
    setInput(prompt.content);
  };

  const handleReset = () => {
    resetChat();
    setShowLabels(true); // Show labels again when resetting
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  // Auto-scroll when new messages arrive or thinking state changes
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages.length, isThinking]); // Use messages.length instead of messages array

  return (
    <View className="flex-1 bg-background">
      <ChatHeader
        onReset={handleReset}
        hasMessages={hasMessages}
      />
      <SafeAreaView className="flex-1">
        {/* Main Content with Keyboard Handling */}
        <KeyboardAvoidingView
          className="flex-1"
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? 155 : 80}
        >
          {/* Messages Area */}
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 px-4 pb-4"
            contentContainerStyle={{
              flexGrow: hasMessages ? 0 : 1, // Only flex when no messages for centering
              paddingTop: hasMessages ? 4 : 16,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {!hasMessages ? (
              // Welcome message when no conversation yet
              <View className="flex-1 items-center justify-center px-8">
                <Animated.View 
                  entering={FadeInDown.duration(800).delay(200)}
                  className="items-center"
                >
                  <View className="relative mb-6">
                    <Bot 
                      size={80} 
                      color={iconColors.primary} 
                      className="mb-4"
                    />
                    <Animated.View
                      entering={FadeInDown.duration(600).delay(600)}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles 
                        size={28} 
                        color={iconColors.primary} 
                      />
                    </Animated.View>
                  </View>
                  
                  <Animated.Text 
                    entering={FadeInDown.duration(800).delay(400)}
                    className="text-foreground text-2xl font-bold text-center mb-2"
                  >
                    {t('ai.welcome.title')}
                  </Animated.Text>
                  
                  <Animated.Text 
                    entering={FadeInDown.duration(800).delay(600)}
                    className="text-muted-foreground text-base text-center leading-6"
                  >
                    {t('ai.welcome.subtitle')}
                  </Animated.Text>
                </Animated.View>
              </View>
            ) : (
              // Show messages
              messages.map((message) => {
                const isLatestAI = message.id === latestAIMessageId && message.role === 'assistant';
                const shouldShowActions = message.role === 'assistant'; // Show actions for ALL AI messages
                
                return (
                  <MessageBubble
                    key={message.id}
                    message={message}
                                          showTypewriter={isLatestAI}
                    showActions={shouldShowActions}
                    onTypewriterCharacter={() => {
                      // Auto-scroll when AI is typing
                      setTimeout(() => {
                        scrollViewRef.current?.scrollToEnd({ animated: true });
                      }, 50);
                    }}
                    onPress={() => {
                      // Handle message press (copy, share, etc.)
                    }}
                  />
                );
              })
            )}

            {/* AI Thinking Loader */}
            <AIThinkingLoader isVisible={isThinking} />

            {/* Error Message */}
            {error && (
              <Animated.View
                entering={FadeIn.duration(300)}
                className="bg-destructive/20 border border-destructive/40 rounded-xl p-3 my-2"
              >
                <MessageBubble
                  message={{
                    id: 'error',
                    role: 'system',
                    content: error,
                    timestamp: new Date(),
                  }}
                />
              </Animated.View>
            )}
          </ScrollView>

          {/* Bottom Input Section */}
          <View className="bg-background">
            {/* Prompt Labels - separate state for animation control */}
         
              <PromptLabels
                prompts={quickPrompts}
                onSelectPrompt={handlePromptSelect}
                exiting={!showLabels}
              />
          

            {/* Custom Input - Always visible */}
            <AutoResizingInput
              value={input}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
              placeholder={t('ai.placeholder')}
              disabled={isLoading}
            />
          </View>
        
          
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}