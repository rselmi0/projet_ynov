import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';

// Screen dimensions for responsive design
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Animation constants
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3; // 30% of screen width to trigger menu
const MENU_WIDTH = SCREEN_WIDTH * 0.6; // Menu takes 60% of screen width
const SPRING_CONFIG = { damping: 20, stiffness: 100 }; // Default spring animation
const MENU_SPRING_CONFIG = { damping: 25, stiffness: 120 }; // Smoother menu animation

// Sample chapter data for demonstration
const chapters = [
  { id: 1, title: 'Introduction', content: 'Lorem ipsum dolor sit amet...' },
  { id: 2, title: 'Getting Started', content: 'Sed do eiusmod tempor incididunt...' },
  { id: 3, title: 'Advanced Topics', content: 'Ut enim ad minim veniam...' },
  { id: 4, title: 'Best Practices', content: 'Duis aute irure dolor...' },
  { id: 5, title: 'Conclusion', content: 'Excepteur sint occaecat cupidatat...' },
];

/**
 * Chapter Indicators Component
 * Shows visual dots representing chapters with current chapter highlighted
 */
const ChapterIndicators = ({ currentChapter }: { currentChapter: number }) => (
  <View style={{ 
    flex: 1, 
    justifyContent: 'space-around', 
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  }}>
    {chapters.map((_, index) => (
      <View
        key={index}
        style={{
          width: index === currentChapter ? 16 : 10, // Active chapter is larger
          height: index === currentChapter ? 3 : 2,
          backgroundColor: index === currentChapter ? '#FF6B35' : 'rgba(255,255,255,0.5)',
          borderRadius: 1.5,
        }}
      />
    ))}
  </View>
);

/**
 * Cross Icon Component
 * Creates an X icon using two rotated lines
 */
const CrossIcon = () => (
  <>
    <View style={{ 
      position: 'absolute',
      width: 12, 
      height: 2, 
      backgroundColor: '#fff',
      transform: [{ rotate: '45deg' }]
    }} />
    <View style={{ 
      position: 'absolute',
      width: 12, 
      height: 2, 
      backgroundColor: '#fff',
      transform: [{ rotate: '-45deg' }]
    }} />
  </>
);

/**
 * Navigation Button Component
 * Displays a semi-circle button that morphs between dots and cross icon
 * Can be positioned on right edge (closed menu) or left of menu (open menu)
 */
const NavigationButton = ({ 
  onPress, 
  currentChapter, 
  buttonIconProgress, 
  isAttachedToMenu = false 
}: {
  onPress: () => void;
  currentChapter: number;
  buttonIconProgress: Animated.SharedValue<number>;
  isAttachedToMenu?: boolean;
}) => {
  // Animated style for cross icon (appears when menu opens)
  const crossIconStyle = useAnimatedStyle(() => ({
    opacity: buttonIconProgress.value,
    transform: [
      { rotate: `${buttonIconProgress.value * 360}deg` }, // Rotates in
      { scale: buttonIconProgress.value }
    ],
  }));

  // Animated style for chapter dots (appears when menu closed)
  const dotsIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - buttonIconProgress.value,
    transform: [
      { scale: 1 - buttonIconProgress.value * 0.2 } // Slightly shrinks
    ],
  }));

  // Semi-circle button styling with dynamic positioning
  const buttonStyle = {
    position: 'absolute' as const,
    [isAttachedToMenu ? 'left' : 'right']: isAttachedToMenu ? -28 : 0, // Position based on menu state - overlaps slightly when attached
    top: SCREEN_HEIGHT / 2 - 50,
    width: 30,
    height: 100,
    backgroundColor: '#000',
    borderTopLeftRadius: 30, // Creates semi-circle shape
    borderBottomLeftRadius: 30,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    transform: [{ translateY: -50 }],
    paddingVertical: 14,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={buttonStyle}
      activeOpacity={isAttachedToMenu ? 1 : 0.8}
    >
      {/* Cross Icon - Shows when menu is open */}
      <Animated.View style={[{
        position: 'absolute',
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
      }, crossIconStyle]}>
        <CrossIcon />
      </Animated.View>

      {/* Chapter Dots - Shows when menu is closed */}
      <Animated.View style={[dotsIconStyle]}>
        <ChapterIndicators currentChapter={currentChapter} />
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Chapter Content Component
 * Renders individual chapter with title and multiple paragraphs
 */
const ChapterContent = ({ 
  chapter, 
  index, 
  onLayout 
}: {
  chapter: typeof chapters[0];
  index: number;
  onLayout: (event: any) => void;
}) => (
  <View 
    style={{ marginBottom: 40 }}
    onLayout={onLayout}
  >
    {/* Chapter title with bottom border */}
    <Text style={{ 
      fontSize: 24, 
      fontWeight: 'bold', 
      color: '#333', 
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 10,
    }}>
      {chapter.title}
    </Text>

    {/* Multiple content paragraphs with Lorem Ipsum text */}
    {[
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
      index < chapters.length - 1 ? 'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.' : null
    ].filter(Boolean).map((text, i) => (
      <Text key={i} style={{ 
        fontSize: 16, 
        color: '#333', 
        lineHeight: 24, 
        marginBottom: 20 
      }}>
        {text}
      </Text>
    ))}
  </View>
);

/**
 * Menu Item Component
 * Renders individual menu item with chapter number and title
 * Highlights current chapter with different styling
 */
const MenuItem = ({ 
  chapter, 
  index, 
  currentChapter, 
  onPress 
}: {
  chapter: typeof chapters[0];
  index: number;
  currentChapter: number;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 8,
      borderRadius: 8,
      backgroundColor: 'transparent',
    }}
    activeOpacity={0.7}
  >
    <Text style={{
      color: index === currentChapter ? '#FF6B35' : '#888', // Highlight current chapter
      fontSize: 16,
      fontWeight: index === currentChapter ? 'bold' : 'normal',
    }}>
      {String(index + 1).padStart(2, '0')}. {chapter.title}
    </Text>
  </TouchableOpacity>
);

/**
 * SwipeAnimationDemo Component
 * Main component that demonstrates swipe-to-open menu with animated content
 */
export default function SwipeAnimationDemo() {
  // Component state
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isMenuOpenState, setIsMenuOpenState] = useState(false);
  const [chapterPositions, setChapterPositions] = useState<number[]>([]);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  
  // Reanimated shared values for animations
  const menuTranslateX = useSharedValue(MENU_WIDTH); // Menu position (starts off-screen)
  const isMenuOpen = useSharedValue(false); // Menu state
  const scrollY = useSharedValue(0); // Scroll position
  const buttonIconProgress = useSharedValue(0); // Button icon animation (0=dots, 1=cross)
  const menuContentProgress = useSharedValue(0); // Menu content fade animation

  /**
   * Animation Functions
   * Handle smooth menu opening and closing with coordinated animations
   */
  const animateMenuOpen = () => {
    menuTranslateX.value = withSpring(0, SPRING_CONFIG); // Slide menu in
    buttonIconProgress.value = withSpring(1, SPRING_CONFIG); // Morph to cross icon
    menuContentProgress.value = withSpring(1, MENU_SPRING_CONFIG); // Fade in content
    isMenuOpen.value = true;
    setIsMenuOpenState(true);
  };

  const animateMenuClose = () => {
    menuContentProgress.value = withSpring(0, SPRING_CONFIG); // Fade out content first
    menuTranslateX.value = withSpring(MENU_WIDTH, SPRING_CONFIG); // Slide menu out
    buttonIconProgress.value = withSpring(0, SPRING_CONFIG); // Morph back to dots
    isMenuOpen.value = false;
    setIsMenuOpenState(false);
  };

  const toggleMenu = () => {
    if (isMenuOpen.value) {
      animateMenuClose();
    } else {
      animateMenuOpen();
    }
  };

  /**
   * Chapter Navigation
   * Scrolls to specific chapter and closes menu
   */
  const goToChapter = (chapterIndex: number) => {
    const targetY = (chapterPositions[chapterIndex] ?? chapterIndex * 500) - 50; // Offset for header
    scrollViewRef.current?.scrollTo({ y: targetY, animated: true });
    setCurrentChapter(chapterIndex);
    toggleMenu(); // Close menu after selection
  };

  /**
   * Reading Progress Tracker
   * Updates current chapter and overall progress based on scroll position
   */
  const updateReadingProgress = (scrollOffset: number, contentHeight: number, layoutHeight: number) => {
    const maxScroll = Math.max(0, contentHeight - layoutHeight);
    const overallProgress = maxScroll > 0 ? Math.min(1, scrollOffset / maxScroll) : 0;
    
    // Determine current chapter based on scroll position
    if (chapterPositions.length > 0) {
      let currentChapterIndex = 0;
      for (let i = 0; i < chapterPositions.length; i++) {
        if (scrollOffset >= chapterPositions[i] - 100) { // 100px tolerance
          currentChapterIndex = i;
        }
      }
      setCurrentChapter(currentChapterIndex);
    }
    
    setReadingProgress(overallProgress);
  };

  /**
   * Event Handlers
   * Handle scroll tracking and swipe gestures
   */
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      // Update reading progress on UI thread
      runOnJS(updateReadingProgress)(
        event.contentOffset.y,
        event.contentSize.height,
        event.layoutMeasurement.height
      );
    },
  });

  // Pan gesture for swipe-to-open menu functionality
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only respond to left swipes when menu is closed
      if (event.translationX < 0 && !isMenuOpen.value) {
        const progress = Math.abs(event.translationX) / SWIPE_THRESHOLD;
        menuTranslateX.value = MENU_WIDTH * (1 - Math.min(1, progress));
      }
    })
    .onEnd((event) => {
      // Determine if swipe should open menu based on distance or velocity
      const shouldOpen = 
        Math.abs(event.translationX) > SWIPE_THRESHOLD || 
        (Math.abs(event.translationX) > 50 && event.velocityX < -500);

      if (shouldOpen && !isMenuOpen.value) {
        runOnJS(animateMenuOpen)();
      } else {
        runOnJS(animateMenuClose)();
      }
    });

  /**
   * Animated Styles
   * Define reanimated styles for smooth animations
   */
  const animatedMenuStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: menuTranslateX.value }],
  }));

  const menuTitleStyle = useAnimatedStyle(() => ({
    opacity: menuContentProgress.value,
    transform: [
      { scale: 0.8 + (menuContentProgress.value * 0.2) }, // Grows in
      { translateY: (1 - menuContentProgress.value) * 20 } // Slides up
    ],
  }));

  const menuItemsStyle = useAnimatedStyle(() => ({
    opacity: menuContentProgress.value,
    transform: [
      { scale: 0.9 + (menuContentProgress.value * 0.1) }, // Subtle scale
      { translateY: (1 - menuContentProgress.value) * 30 } // Slides up
    ],
  }));

  /**
   * Chapter Layout Handler
   * Captures chapter positions for accurate scroll navigation
   */
  const handleChapterLayout = (index: number) => (event: any) => {
    const { y } = event.nativeEvent.layout;
    setChapterPositions(prev => {
      const newPositions = [...prev];
      newPositions[index] = y;
      return newPositions;
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Main Content Area with Swipe Detection */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={{ flex: 1 }}>
          {/* Scrollable Chapter Content */}
          <Animated.ScrollView
            ref={scrollViewRef}
            style={{ flex: 1, backgroundColor: '#fff' }}
            contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
            {chapters.map((chapter, index) => (
              <ChapterContent
                key={chapter.id}
                chapter={chapter}
                index={index}
                onLayout={handleChapterLayout(index)}
              />
            ))}
          </Animated.ScrollView>
        </Animated.View>
      </GestureDetector>

      {/* Floating Navigation Button - Only visible when menu is closed */}
      {!isMenuOpenState && (
        <NavigationButton
          onPress={toggleMenu}
          currentChapter={currentChapter}
          buttonIconProgress={buttonIconProgress}
        />
      )}

      {/* Sliding Side Menu */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            right: 0,
            width: MENU_WIDTH,
            height: '100%',
            backgroundColor: '#000',
            paddingTop: 60,
            paddingHorizontal: 20,
          },
          animatedMenuStyle,
        ]}
      >
        {/* Navigation Button - Attached to menu when open */}
        <NavigationButton
          onPress={toggleMenu}
          currentChapter={currentChapter}
          buttonIconProgress={buttonIconProgress}
          isAttachedToMenu
        />

        {/* Menu Title with Fade Animation */}
        <Animated.Text style={[
          { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 }, 
          menuTitleStyle
        ]}>
          Chapters
        </Animated.Text>

        {/* Chapter List with Animated Items */}
        <Animated.View style={[{ flex: 1 }, menuItemsStyle]}>
          {chapters.map((chapter, index) => (
            <MenuItem
              key={chapter.id}
              chapter={chapter}
              index={index}
              currentChapter={currentChapter}
              onPress={() => goToChapter(index)}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </View>
  );
} 