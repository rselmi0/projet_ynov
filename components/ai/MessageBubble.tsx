import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { ChatMessage } from '../../types/ai';
import ThinkingAnimation from './ThinkingAnimation';
import TypewriterText from './TypewriterText';
import MessageActions from './MessageActions';

interface MessageBubbleProps {
  message: ChatMessage;
  onPress?: () => void;
  showTypewriter?: boolean;
  onTypewriterCharacter?: () => void; // Callback for auto-scroll during typing
  showActions?: boolean; // Show actions for AI messages
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onPress,
  showTypewriter = false,
  onTypewriterCharacter,
  showActions = false,
}) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isAI = message.role === 'assistant';

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const textClassName = `
    text-base leading-6
    ${isSystem 
      ? 'text-accent-foreground font-semibold' 
      : isUser 
        ? 'text-primary-foreground' 
        : 'text-card-foreground'
    }
  `;

  return (
    <>
      <Animated.View 
        entering={isUser ? FadeInUp.duration(300) : FadeInDown.duration(300)}
        className="mb-3"
      >
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          className={`
            p-3 px-4 rounded-2xl max-w-[85%] shadow-sm
            ${isSystem 
              ? 'bg-accent/20 border border-accent/40 self-center' 
              : isUser 
                ? 'bg-primary self-end rounded-br-md' 
                : 'bg-card self-start rounded-bl-md'
            }
          `}
        >
          {message.isThinking ? (
            <ThinkingAnimation isVisible={true} />
          ) : (
            <>
                          {isAI && showTypewriter ? (
              <TypewriterText
                text={message.content}
                speed={5}
                className={textClassName}
                onCharacter={onTypewriterCharacter}
              />
            ) : (
                <Text className={textClassName}>
                  {message.content}
                </Text>
              )}
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
      
      {/* Show actions for AI messages */}
      {isAI && showActions && !message.isThinking && (
        <MessageActions 
          messageContent={message.content}
          onLike={() => {
            // Handle like action - could be connected to analytics/feedback system
          }}
        />
      )}
    </>
  );
};

export default MessageBubble; 