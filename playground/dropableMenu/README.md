# Floating Review Interface

A smooth, animated floating review interface for React Native applications built with Expo and React Native Reanimated 3.

## 🌟 Features

- **Smooth Animations**: Fluid transitions powered by React Native Reanimated 3
- **Interactive Star Rating**: Animated star rating with glow effects
- **Responsive Layout**: Adapts to different screen sizes
- **Contextual UI**: Button morphs based on interaction state
- **Blur Effects**: Modern glassmorphism design with blur overlays
- **Dark/Light Theme Support**: Automatically adapts to system color scheme
- **Touch Feedback**: Visual feedback for all interactive elements

## 📱 Demo

The demo showcases a complete floating review workflow:

1. **Initial State**: Full-width "Leave a Review" button at the bottom
2. **Review Open**: Content slides up, button collapses to center
3. **Rating**: Interactive star rating with animations
4. **Submit**: Auto-closes after rating submission
5. **Completion**: Button shows rating count, allows reset

## 🏗️ Architecture

### Components Structure

```
FloatingReviewDemo/
├── containerUI.tsx           # Main container with slide animations
├── FloatingReviewDemo.tsx    # Main demo component
└── README.md                # This documentation
```

### Core Components

#### `ReviewUIContainer`
The main container that handles:
- Content sliding animations
- Review panel overlay
- Header with rounded corners and blur effect
- Close interaction handling

#### `FloatingReviewDemo`
The complete demo implementation featuring:
- State management for review flow
- Floating action button with morphing animations
- Star rating interface
- Demo content generation

#### Supporting Components
- `StarRating`: Interactive star rating with animations
- `ReviewPanel`: Review interface content
- `DemoContent`: Sample content for demonstration
- `FloatingActionButton`: Animated floating action button
- `LeftCornerSvg` & `RightCornerSvg`: Custom SVG corner elements
- `CloseBar`: Drag-to-close indicator

## 🛠️ Technical Implementation

### Animation System

The component uses React Native Reanimated 3 with shared values for smooth 60fps animations:

```typescript
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
```

### Key Animation Patterns

1. **Slide Animations**: Content smoothly slides up/down
2. **Scale Animations**: Interactive feedback on touch
3. **Morphing Animations**: Button width and position changes
4. **Glow Effects**: Star rating visual feedback

### State Management

```typescript
// Review state
const [isReviewOpen, setIsReviewOpen] = useState(false);
const [rating, setRating] = useState(0);
const [isSubmitted, setIsSubmitted] = useState(false);

// Animation values
const buttonWidth = useSharedValue(BUTTON_CONFIG.FULL_WIDTH);
const buttonTranslateX = useSharedValue(0);
const buttonScale = useSharedValue(SCALE_VALUES.NORMAL);
```

## 🎨 Design Features

### Visual Elements

- **Glassmorphism**: Blur effects with `expo-blur`
- **Rounded Corners**: Custom SVG corner implementations
- **Shadows**: Layered shadow effects for depth
- **Color Adaptation**: Dark/light theme support

### Interaction Design

- **Progressive Disclosure**: Interface reveals progressively
- **Visual Feedback**: All interactions provide immediate feedback
- **Contextual Actions**: Button behavior changes based on state
- **Gesture Support**: Drag-to-close functionality

## 🚀 Usage

### Basic Implementation

```tsx
import { ReviewUIContainer } from './containerUI';
import FloatingReviewDemo from './FloatingReviewDemo';

// Use the complete demo
<FloatingReviewDemo />

// Or use just the container with custom content
<ReviewUIContainer 
  isVisible={isVisible}
  reviewContent={<YourReviewComponent />}
  onClose={handleClose}
>
  <YourMainContent />
</ReviewUIContainer>
```

### Customization

#### Container Props

```typescript
type ReviewUIContainerProps = {
  children: React.ReactNode;        // Main content to slide
  isVisible: boolean;               // Show/hide review panel
  reviewContent?: React.ReactNode;  // Review panel content
  onClose?: () => void;            // Close callback
};
```

#### Animation Configuration

Modify constants in the component files to adjust:
- Animation durations
- Scale values
- Button dimensions
- Menu height ratio

## 📋 Dependencies

- **React Native**: ^0.74.0
- **Expo**: ^51.0.0
- **React Native Reanimated**: ^3.10.0
- **React Native SVG**: ^15.2.0
- **Expo Blur**: ^13.0.0

## 🎯 Use Cases

Perfect for:
- **App Store Reviews**: Collect user ratings and feedback
- **Product Reviews**: E-commerce and marketplace apps
- **Service Ratings**: Food delivery, ride-sharing apps
- **Content Feedback**: Social media and content platforms
- **User Experience**: Any app requiring user feedback

## 🔧 Configuration

### Theme Support

The component automatically adapts to:
- System color scheme (dark/light)
- Custom theme colors via props
- Tailwind CSS classes for styling

### Performance

- Uses `useSharedValue` for 60fps animations
- Minimal re-renders with React.memo patterns
- Optimized SVG components for smooth rendering

## 🎨 Customization Examples

### Custom Colors

```tsx
// Modify in StarRating component
<Icons.Star
  color={star <= rating ? '#FF6B6B' : '#E5E7EB'}
  fill={star <= rating ? '#FF6B6B' : 'transparent'}
/>
```

### Custom Animation Timing

```tsx
// Adjust in animation constants
const ANIMATION_DURATION = {
  SHORT: 100,    // Faster interactions
  MEDIUM: 150,   // Quick feedback
  LONG: 250,     // Smooth transitions
  EXTRA_LONG: 350, // Dramatic effects
};
```

### Custom Button Styles

```tsx
// Modify button configuration
const BUTTON_CONFIG = {
  FULL_WIDTH: width - 32,      // Different margins
  COLLAPSED_WIDTH: 100,        // Smaller collapsed state
  BOTTOM_MARGIN: 24,          // Different positioning
  SIDE_MARGIN: 16,
};
```

## 📝 Notes

- Built for iOS and Android
- Tested on various screen sizes
- Optimized for performance
- Accessible design patterns
- Production-ready code

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This component is part of a larger React Native application template. 