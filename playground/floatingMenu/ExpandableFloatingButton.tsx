import React, { useEffect } from 'react';
import { View, Pressable, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useFloatingMenuStore } from './floatingMenuStore';
import { Plus, X } from 'lucide-react-native';

interface ExpandableFloatingButtonProps {
  children?: React.ReactNode;
  size?: number;
  expandedWidth?: number;
  expandedHeight?: number;
  onToggle?: () => void;
}

const BUTTON_SIZE = 56;

export const ExpandableFloatingButton: React.FC<ExpandableFloatingButtonProps> = ({ 
  children,
  size = BUTTON_SIZE,
  expandedWidth = 320,
  expandedHeight = 350,
  onToggle
}) => {
  const store = useFloatingMenuStore();
  
  // Safety check for store initialization with fallback values
  const position = store?.position || { x: 50, y: 100 };
  const isExpanded = store?.isExpanded || false;
  const isDragging = store?.isDragging || false;
  const setPosition = store?.setPosition || (() => {});
  const setDragging = store?.setDragging || (() => {});
  const snapToEdge = store?.snapToEdge || (() => {});
  const toggleExpanded = store?.toggleExpanded || (() => {});

  // Screen dimensions
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  // Handle toggle menu
  const handleToggleMenu = () => {
    toggleExpanded();
    onToggle?.();
  };

  // Calculate safe expanded dimensions and position
  const safeExpandedWidth = Math.min(expandedWidth, screenWidth - 40);
  const safeExpandedHeight = Math.min(expandedHeight, screenHeight - 200);
  
  // Calculate expansion position (center the expanded menu on the button)
  const buttonCenterX = position.x + size / 2;
  const buttonCenterY = position.y + size / 2;
  const expandedX = Math.max(20, Math.min(screenWidth - safeExpandedWidth - 20, buttonCenterX - safeExpandedWidth / 2));
  const expandedY = Math.max(60, Math.min(screenHeight - safeExpandedHeight - 100, buttonCenterY - safeExpandedHeight / 2));

  // Reanimated shared values
  const translateX = useSharedValue(position?.x || 50);
  const translateY = useSharedValue(position?.y || 100);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  
  // Expansion animation values
  const containerWidth = useSharedValue(size);
  const containerHeight = useSharedValue(size);
  const borderRadius = useSharedValue(size / 2);
  const contentOpacity = useSharedValue(0);
  const iconScale = useSharedValue(1);

  // Update position when store changes
  useEffect(() => {
    if (translateX && translateY && position) {
      translateX.value = withSpring(position.x || 50, {
        damping: 15,
        stiffness: 200,
      });
      translateY.value = withSpring(position.y || 100, {
        damping: 15,
        stiffness: 200,
      });
    }
  }, [position, translateX, translateY]);

  // Handle expansion animation
  useEffect(() => {
    if (isExpanded) {
      // Expand animation - button morphs into menu
      translateX.value = withSpring(expandedX, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(expandedY, { damping: 15, stiffness: 150 });
      containerWidth.value = withSpring(safeExpandedWidth, { damping: 15, stiffness: 150 });
      containerHeight.value = withSpring(safeExpandedHeight, { damping: 15, stiffness: 150 });
      borderRadius.value = withSpring(24, { damping: 15, stiffness: 150 });
      contentOpacity.value = withTiming(1, { duration: 300 });
      iconScale.value = withSpring(0.9, { damping: 15, stiffness: 200 });
      rotation.value = withSpring(1, { damping: 15, stiffness: 200 });
    } else {
      // Collapse animation - menu morphs back to button
      translateX.value = withSpring(position.x || 50, { damping: 15, stiffness: 150 });
      translateY.value = withSpring(position.y || 100, { damping: 15, stiffness: 150 });
      containerWidth.value = withSpring(size, { damping: 15, stiffness: 150 });
      containerHeight.value = withSpring(size, { damping: 15, stiffness: 150 });
      borderRadius.value = withSpring(size / 2, { damping: 15, stiffness: 150 });
      contentOpacity.value = withTiming(0, { duration: 200 });
      iconScale.value = withSpring(1, { damping: 15, stiffness: 200 });
      rotation.value = withSpring(0, { damping: 15, stiffness: 200 });
    }
  }, [isExpanded, position.x, position.y, expandedX, expandedY, safeExpandedWidth, safeExpandedHeight, size]);

  // Gesture handler for dragging only (when collapsed)
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; startY: number }
  >({
    onStart: (_, context) => {
      if (!isExpanded && translateX && translateY && scale) {
        context.startX = translateX.value || 50;
        context.startY = translateY.value || 100;
        
        scale.value = withSpring(1.1, {
          damping: 15,
          stiffness: 200,
        });
        
        runOnJS(setDragging)(true);
      }
    },
    onActive: (event, context) => {
      if (!isExpanded && translateX && translateY) {
        const newX = Math.max(
          0, 
          Math.min(
            screenWidth - size, 
            (context.startX || 50) + event.translationX
          )
        );
        
        const newY = Math.max(
          50,
          Math.min(
            screenHeight - size - 100,
            (context.startY || 100) + event.translationY
          )
        );

        translateX.value = newX;
        translateY.value = newY;
      }
    },
    onEnd: () => {
      if (!isExpanded && scale && translateX && translateY) {
        scale.value = withSpring(1, {
          damping: 15,
          stiffness: 200,
        });
        
        runOnJS(setDragging)(false);
        runOnJS(setPosition)({ x: translateX.value || 50, y: translateY.value || 100 });
        runOnJS(snapToEdge)(screenWidth, size);
      }
    },
  });



  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    if (!translateX || !translateY || !scale || !containerWidth || !containerHeight || !borderRadius) return {};
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
      width: containerWidth.value,
      height: containerHeight.value,
      borderRadius: borderRadius.value,
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    if (!rotation || !iconScale) return {};
    const rotate = interpolate(rotation.value, [0, 1], [0, 45]);
    return {
      transform: [
        { rotate: `${rotate}deg` },
        { scale: iconScale.value }
      ],
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    if (!contentOpacity) return {};
    return {
      opacity: contentOpacity.value,
    };
  });

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      shouldCancelWhenOutside={false}
      enabled={!isExpanded} // Only enabled when collapsed for dragging
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#000000',
            justifyContent: isExpanded ? 'flex-start' : 'center',
            alignItems: isExpanded ? 'stretch' : 'center',
            zIndex: 10000,
            elevation: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          containerStyle,
        ]}
      >
        {/* Icon (always visible in top-right when expanded, center when collapsed) */}
        <TouchableOpacity
          onPress={handleToggleMenu}
          activeOpacity={0.7}
          style={{
            position: isExpanded ? 'absolute' : 'relative',
            top: isExpanded ? 16 : 0,
            right: isExpanded ? 16 : 0,
            width: isExpanded ? 40 : size,
            height: isExpanded ? 40 : size,
            borderRadius: isExpanded ? 20 : size / 2,
            backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <Animated.View style={iconStyle}>
            {isExpanded ? (
              <X size={20} color="#ffffff" strokeWidth={2.5} />
            ) : (
              <Plus size={24} color="#ffffff" strokeWidth={2.5} />
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Expanded content */}
        {isExpanded && (
          <Animated.View
            style={[
              {
                flex: 1,
                paddingTop: 60, // Space for close button
                paddingHorizontal: 20,
                paddingBottom: 20,
              },
              contentStyle,
            ]}
          >
            {children ? (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={true}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={{ gap: 16 }}>
                {/* Default content */}
                <View style={{
                  height: 52,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                }} />
                <View style={{
                  height: 52,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                }} />
                <View style={{
                  height: 52,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                }} />
              </View>
            )}
          </Animated.View>
        )}
              </Animated.View>
    </PanGestureHandler>
  );
}; 