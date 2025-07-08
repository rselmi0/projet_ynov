import React from 'react';
import { TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Icons } from '@/icons';
import { useIconColors } from '@/hooks/useIconColors';

interface HeaderMenuProps {
  onPress: () => void;
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ onPress }) => {
  const iconColors = useIconColors();
  const handlePress = () => {
    // Feedback haptique léger style iOS
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="rounded-xl bg-white/80 p-3 shadow-sm backdrop-blur-md dark:bg-transparent"
      activeOpacity={0.6}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}>
      <Icons.Menu size={22} color={iconColors.base} strokeWidth={2.5} />
    </TouchableOpacity>
  );
};
