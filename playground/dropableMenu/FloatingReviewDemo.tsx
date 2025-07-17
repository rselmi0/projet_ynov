import React, { useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icons } from '@/icons';
import { useColorScheme } from 'react-native';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import ReviewUIContainer from './containerUI';

const { width } = Dimensions.get('window');

// Animation constants
const ANIMATION_DURATION = {
  SHORT: 150,
  MEDIUM: 200,
  LONG: 300,
  EXTRA_LONG: 400,
};

const SCALE_VALUES = {
  NORMAL: 1,
  PRESSED: 0.9,
  SLIGHTLY_PRESSED: 0.95,
  ENLARGED: 1.1,
};

const BUTTON_CONFIG = {
  FULL_WIDTH: width - 40,
  COLLAPSED_WIDTH: 120,
  BOTTOM_MARGIN: 34,
  SIDE_MARGIN: 20,
};

// Helper function for button animations
const animateButton = (
  scale: Reanimated.SharedValue<number>,
  targetScale: number = SCALE_VALUES.PRESSED,
  returnScale: number = SCALE_VALUES.NORMAL
) => {
  scale.value = withTiming(targetScale, { duration: ANIMATION_DURATION.SHORT }, () => {
    scale.value = withTiming(returnScale, { duration: ANIMATION_DURATION.SHORT });
  });
};

// Helper function for star animations
const animateStars = (
  starsScale: Reanimated.SharedValue<number>,
  starGlow: Reanimated.SharedValue<number>
) => {
  // Scale animation
  starsScale.value = withTiming(SCALE_VALUES.ENLARGED, { duration: ANIMATION_DURATION.SHORT }, () => {
    starsScale.value = withTiming(SCALE_VALUES.NORMAL, { duration: ANIMATION_DURATION.SHORT });
  });
  
  // Glow animation
  starGlow.value = withTiming(0.8, { duration: ANIMATION_DURATION.MEDIUM }, () => {
    starGlow.value = withTiming(0.3, { duration: ANIMATION_DURATION.LONG });
  });
};

// Star Rating Component
const StarRating = ({ 
  rating, 
  onRatingChange, 
  starsScale, 
  starGlow 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void;
  starsScale: Reanimated.SharedValue<number>;
  starGlow: Reanimated.SharedValue<number>;
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const starsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: starsScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: starGlow.value,
    shadowRadius: starGlow.value * 10,
    elevation: starGlow.value * 5,
  }));

  const handleStarPress = (star: number) => {
    animateStars(starsScale, starGlow);
    onRatingChange(star);
  };
  
  return (
    <Reanimated.View style={[starsAnimatedStyle, glowAnimatedStyle]} className="flex-row justify-center gap-2 my-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => handleStarPress(star)}
          className="p-2"
        >
          <Icons.Star
            color={star <= rating ? '#FFFFFF' : (isDark ? '#374151' : '#D1D5DB')}
            fill={star <= rating ? '#FFFFFF' : 'transparent'}
            size={30}
          />
        </TouchableOpacity>
      ))}
    </Reanimated.View>
  );
};

// Review Panel Content Component
const ReviewPanel = ({ 
  rating, 
  setRating, 
  starsScale, 
  starGlow 
}: {
  rating: number;
  setRating: (rating: number) => void;
  starsScale: Reanimated.SharedValue<number>;
  starGlow: Reanimated.SharedValue<number>;
}) => {
  return (
    <View className="flex-1 items-center p-4 pt-6">
      <Text
        style={{ color: 'gray' }}
        className="font-semibold text-center mb-6"
      >
        Rate your experience
      </Text>
      
      <StarRating 
        rating={rating} 
        onRatingChange={setRating}
        starsScale={starsScale}
        starGlow={starGlow}
      />
    </View>
  );
};

// Demo Content Component
const DemoContent = ({ isDark }: { isDark: boolean }) => (
  <ScrollView className="flex-1 bg-background">
    {/* Header Section */}
    <View className="px-6 pt-12 mt-6 pb-6 bg-primary/5 border-b border-border">
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
          <Icons.Star size={20} color={isDark ? '#FBBF24' : '#F59E0B'} />
        </View>
        <Text className="text-foreground text-2xl font-bold">
          Floating Review
        </Text>
      </View>
      <Text className="text-muted-foreground text-base">
        Demo of animated floating review interface
      </Text>
    </View>

    {/* Instructions Section */}
    <View className="px-6 py-6">
      <View className="bg-card border border-border rounded-xl p-6 mb-6">
        <Text className="text-foreground text-lg font-semibold mb-3">
          How it works
        </Text>
        {[
          'Tap the floating button at the bottom to open the review interface',
          'The entire page content slides up to make room for the review panel',
          'Rate your experience and submit your feedback',
          'The interface smoothly animates back to its original state'
        ].map((instruction, index) => (
          <Text key={index} className="text-muted-foreground text-sm leading-relaxed mb-4">
            • {instruction}
          </Text>
        ))}
      </View>

      {/* Sample Content Cards */}
      {Array.from({ length: 6 }).map((_, index) => (
        <View key={index} className="bg-card border border-border rounded-xl p-4 mb-4">
          <Text className="text-foreground text-base font-medium mb-2">
            Content Card {index + 1}
          </Text>
          <Text className="text-muted-foreground text-sm">
            This is sample content that will be pushed up when the review interface opens.
            Notice how smoothly everything animates!
          </Text>
        </View>
      ))}
    </View>
  </ScrollView>
);

// Floating Action Button Component
const FloatingActionButton = ({
  isReviewOpen,
  isSubmitted,
  rating,
  buttonWidth,
  buttonTranslateX,
  buttonScale,
  onPress,
  isDark
}: {
  isReviewOpen: boolean;
  isSubmitted: boolean;
  rating: number;
  buttonWidth: Reanimated.SharedValue<number>;
  buttonTranslateX: Reanimated.SharedValue<number>;
  buttonScale: Reanimated.SharedValue<number>;
  onPress: () => void;
  isDark: boolean;
}) => {
  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    width: buttonWidth.value,
    transform: [
      { translateX: buttonTranslateX.value },
      { scale: buttonScale.value }
    ],
  }));

  const isDisabled = rating === 0 && isReviewOpen && !isSubmitted;

  return (
    <Reanimated.View 
      style={[
        {
          position: 'absolute',
          bottom: BUTTON_CONFIG.BOTTOM_MARGIN,
          left: BUTTON_CONFIG.SIDE_MARGIN,
          zIndex: 200,
        },
        buttonAnimatedStyle
      ]}
    >
      <View
        onTouchStart={onPress}
        //disabled={isDisabled}
        className="bg-white rounded-full px-6 py-4 shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          opacity: isDisabled ? 0.5 : 1,
          width: '100%',
        }}
      >
        <View className="flex-row items-center justify-center">
          {isSubmitted && !isReviewOpen ? (
            // State: submitted and closed - show star with rating
            <>
              <Icons.Star color="#FBBF24" fill="transparent" />
              <Text className="text-black font-medium text-base ml-1">
                {rating}
              </Text>
            </>
          ) : (
            // Normal states - show text with star
            <>
              <Icons.Star size={20} color="black" />
              <Text className="text-black font-medium text-base ml-2">
                {isReviewOpen ? 'Submit' : 'Leave a Review'}
              </Text>
            </>
          )}
        </View>
      </View>
    </Reanimated.View>
  );
};

// Main Component
export default function FloatingReviewDemo() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // State management
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animation values
  const buttonWidth = useSharedValue(BUTTON_CONFIG.FULL_WIDTH);
  const buttonTranslateX = useSharedValue(0);
  const buttonScale = useSharedValue(SCALE_VALUES.NORMAL);
  const starsScale = useSharedValue(SCALE_VALUES.NORMAL);
  const starGlow = useSharedValue(0);

  // Animation configuration
  const buttonAnimationConfig = {
    duration: ANIMATION_DURATION.LONG,
    easing: Easing.out(Easing.cubic),
  };

  // Button width and position animations
  const animateButtonToCollapsed = () => {
    buttonWidth.value = withTiming(BUTTON_CONFIG.COLLAPSED_WIDTH, buttonAnimationConfig);
    buttonTranslateX.value = withTiming(
      (width - BUTTON_CONFIG.COLLAPSED_WIDTH) / 2 - BUTTON_CONFIG.SIDE_MARGIN, 
      buttonAnimationConfig
    );
  };

  const animateButtonToExpanded = () => {
    buttonWidth.value = withTiming(BUTTON_CONFIG.FULL_WIDTH, buttonAnimationConfig);
    buttonTranslateX.value = withTiming(0, buttonAnimationConfig);
  };

  // Reset animations helper
  const resetAnimations = () => {
    starsScale.value = SCALE_VALUES.NORMAL;
    starGlow.value = 0;
  };

  // Event handlers
  const handleOpenReview = () => {
    setIsReviewOpen(true);
    animateButtonToCollapsed();
    animateButton(buttonScale, SCALE_VALUES.SLIGHTLY_PRESSED);
  };

  const handleResetReview = () => {
    setRating(0);
    setIsSubmitted(false);
    handleOpenReview();
  };

  const handleSubmitReview = () => {
    animateButton(buttonScale);
    
    // Don't proceed if no rating is given
    if (rating === 0) return;
    
    // Mark as submitted
    setIsSubmitted(true);
    
    // Auto-close after submission
    setTimeout(() => {
      setIsReviewOpen(false);
      animateButtonToExpanded();
      resetAnimations();
      animateButton(buttonScale, SCALE_VALUES.SLIGHTLY_PRESSED);
    }, 100);
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    
    // Reset rating if not submitted
    if (!isSubmitted) {
      setRating(0);
    }
    
    animateButtonToExpanded();
    resetAnimations();
    animateButton(buttonScale, SCALE_VALUES.SLIGHTLY_PRESSED);
  };

  // Determine button action based on current state
  const getButtonAction = () => {
    if (isSubmitted && !isReviewOpen) return handleResetReview;
    if (isReviewOpen) return handleSubmitReview;
    return handleOpenReview;
  };

  const reviewContent = (
    <ReviewPanel
      rating={rating}
      setRating={setRating}
      starsScale={starsScale}
      starGlow={starGlow}
    />
  );

  return (
    <View className="flex-1 bg-background">
      <ReviewUIContainer 
        isVisible={isReviewOpen} 
        reviewContent={reviewContent}
        onClose={handleCloseReview}
      >
        <DemoContent isDark={isDark} />
      </ReviewUIContainer>

      <FloatingActionButton
        isReviewOpen={isReviewOpen}
        isSubmitted={isSubmitted}
        rating={rating}
        buttonWidth={buttonWidth}
        buttonTranslateX={buttonTranslateX}
        buttonScale={buttonScale}
        onPress={getButtonAction()}
        isDark={isDark}
      />
    </View>
  );
} 