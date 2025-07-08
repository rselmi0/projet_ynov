import React from 'react';
import { View } from 'react-native';
import { Text } from './text';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary border-secondary';
      case 'destructive':
        return 'bg-destructive border-destructive';
      case 'outline':
        return 'bg-transparent border-border';
      case 'warning':
        return 'bg-orange-100 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20';
      case 'success':
        return 'bg-emerald-100 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20';
      default:
        return 'bg-primary border-primary';
    }
  };

  const getTextClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'text-secondary-foreground';
      case 'destructive':
        return 'text-destructive-foreground';
      case 'outline':
        return 'text-foreground';
      case 'warning':
        return 'text-orange-600 dark:text-orange-400';
      case 'success':
        return 'text-emerald-600 dark:text-emerald-400';
      default:
        return 'text-primary-foreground';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5';
      case 'lg':
        return 'px-4 py-2';
      default:
        return 'px-3 py-1';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'lg':
        return 'text-base';
      default:
        return 'text-sm';
    }
  };

  return (
    <View
      className={cn(
        'inline-flex items-center rounded-lg border font-medium',
        getVariantClasses(),
        getSizeClasses(),
        className
      )}
    >
      <Text className={cn(getTextClasses(), getTextSize())}>
        {children}
      </Text>
    </View>
  );
}; 