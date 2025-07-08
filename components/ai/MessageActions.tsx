import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Copy, ThumbsUp } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';
import { toast } from 'sonner-native';
import { useIconColors } from '../../hooks/useIconColors';

interface MessageActionsProps {
  messageContent: string;
  onLike?: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({ 
  messageContent, 
  onLike
}) => {
  const iconColors = useIconColors();
  const handleCopy = async () => {
    try {
      await Clipboard.setStringAsync(messageContent);
      toast('✅ Copied!', {
        description: 'Message copied to clipboard',
        duration: 500,

      });
    } catch (error) {
      toast('❌ Error', {
        description: 'Failed to copy message',
        duration: 500,
      });
    }
  };

  const handleLike = () => {
    toast('🎉 Thanks for the feedback!', {
      description: 'Your thumbs up helps improve AI responses',
      duration: 500,
    });
    onLike?.();
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(300).delay(200)}
      className="flex-row items-center ml-4 mb-3"
      style={{ gap: 8 }}
    >
      <TouchableOpacity
        onPress={handleCopy}
        className="flex-row items-center justify-center w-10 h-10 rounded-full bg-muted/40 active:bg-muted/60"
        activeOpacity={0.7}
      >
        <Copy size={16} color={iconColors.secondary} />
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleLike}
        className="flex-row items-center justify-center w-10 h-10 rounded-full bg-muted/40 active:bg-muted/60"
        activeOpacity={0.7}
      >
        <ThumbsUp size={16} color={iconColors.secondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MessageActions; 