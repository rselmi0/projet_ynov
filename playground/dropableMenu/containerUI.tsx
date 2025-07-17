import React from "react";
import { View, Dimensions, TouchableOpacity } from "react-native";
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";
import { BlurView } from "expo-blur";

const { height } = Dimensions.get("window");

// Constants for better maintainability
const ANIMATION_DURATION = 400;
const CORNER_SIZE = 20;
const MENU_HEIGHT_RATIO = 0.3;
const BLUR_INTENSITY = 10;
const CLOSE_BAR_WIDTH = 40;
const CLOSE_BAR_HEIGHT = 4;

// SVG component for left inverted corner
const LeftCornerSvg = () => (
  <View style={{ width: CORNER_SIZE, height: CORNER_SIZE, backgroundColor: "black" }}>
    <Svg width={CORNER_SIZE} height={CORNER_SIZE} viewBox={`0 0 ${CORNER_SIZE} ${CORNER_SIZE}`}>
      <Path d={`M${CORNER_SIZE} ${CORNER_SIZE} Q0 ${CORNER_SIZE} 0 0 L${CORNER_SIZE} 0 Z`} fill="white" />
    </Svg>
  </View>
);

// SVG component for right inverted corner
const RightCornerSvg = () => (
  <View style={{ width: CORNER_SIZE, height: CORNER_SIZE, backgroundColor: "black" }}>
    <Svg width={CORNER_SIZE} height={CORNER_SIZE} viewBox={`0 0 ${CORNER_SIZE} ${CORNER_SIZE}`}>
      <Path d={`M0 ${CORNER_SIZE} Q${CORNER_SIZE} ${CORNER_SIZE} ${CORNER_SIZE} 0 L0 0 Z`} fill="white" />
    </Svg>
  </View>
);

// Close bar component
const CloseBar = ({ onPress }: { onPress?: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={{
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
      backgroundColor: 'transparent',
    }}
  >
    <View
      style={{
        width: CLOSE_BAR_WIDTH,
        height: CLOSE_BAR_HEIGHT,
        backgroundColor: '#404040',
        borderRadius: 2,
      }} 
    />
  </TouchableOpacity>
);

type ReviewUIContainerProps = {
  children: React.ReactNode;
  isVisible: boolean;
  reviewContent?: React.ReactNode;
  onClose?: () => void;
};

const ReviewUIContainer = ({ children, isVisible, reviewContent, onClose }: ReviewUIContainerProps) => {
  // Animation shared values
  const mainContentTranslateY = useSharedValue(0);
  const reviewMenuTranslateY = useSharedValue(height * MENU_HEIGHT_RATIO);

  // Common animation config
  const animationConfig = {
    duration: ANIMATION_DURATION,
    easing: Easing.out(Easing.cubic),
  };

  // Update animations when visibility changes
  React.useEffect(() => {
    if (isVisible) {
      // Move main content up to make space for review menu
      mainContentTranslateY.value = withTiming(-height * MENU_HEIGHT_RATIO, animationConfig);
      // Bring review menu up from bottom
      reviewMenuTranslateY.value = withTiming(0, animationConfig);
    } else {
      // Reset positions - content goes back to original position
      mainContentTranslateY.value = withTiming(0, animationConfig);
      // Menu slides back down to bottom
      reviewMenuTranslateY.value = withTiming(height * MENU_HEIGHT_RATIO, animationConfig);
    }
  }, [isVisible]);

  // Animated styles
  const mainContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: mainContentTranslateY.value }],
  }));

  const reviewMenuStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: reviewMenuTranslateY.value }],
  }));

  const menuHeight = height * MENU_HEIGHT_RATIO;

  return (
    <View style={{ flex: 1 }}>
      {/* Main content that slides up when review panel opens */}
      <Reanimated.View style={[{ flex: 1 }, mainContentStyle]}>
        {children}
      </Reanimated.View>

      {/* Header with corners and close bar - positioned above the container */}
      {isVisible && (
        <Reanimated.View 
          style={[
            {
              position: "absolute",
              bottom: menuHeight,
              left: 0,
              right: 0,
              height: CORNER_SIZE,
              zIndex: 101,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
            reviewMenuStyle
          ]}
        >
          <BlurView
            intensity={BLUR_INTENSITY}
            tint="light"
            style={{   
              flex: 1,
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            {/* Left corner */}
            <LeftCornerSvg />
            
            {/* Close bar in the center */}
            <CloseBar onPress={onClose} />
           
            {/* Right corner */}
            <RightCornerSvg />
          </BlurView>
        </Reanimated.View>
      )}

      {/* Main container with review content - positioned below header */}
      {isVisible && (
        <Reanimated.View 
          style={[
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: menuHeight,
              zIndex: 100,
              backgroundColor: 'black',
            },
            reviewMenuStyle
          ]}
        >
          {/* Review content with top padding to account for header */}
          <View style={{ flex: 1, paddingTop: CORNER_SIZE }}>
            {reviewContent}
          </View>
        </Reanimated.View>
      )}
    </View>
  );
};

export default ReviewUIContainer;