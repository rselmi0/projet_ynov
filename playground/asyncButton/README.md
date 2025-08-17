# AsyncButton Component

A highly customizable and animated button component for React Native applications, built with React Native Reanimated for smooth 60fps animations.

## Features

✨ **Smooth Animations**: Text slides up/down with dynamic width resizing  
🎨 **Multiple Variants**: Primary, secondary, success, and error color schemes  
📏 **Dynamic Sizing**: Automatically adjusts width based on text content  
🎯 **State Management**: Idle, pending, success, and error states with visual feedback  
⚡ **Performance**: Built with React Native Reanimated for native performance  
🎭 **Visual Feedback**: Scale animation on press with realistic button styling  
📳 **Haptic Feedback**: Rich tactile feedback for touches and state changes  

## Demo

You can see all features in action by navigating to the Playground section in the app and selecting "Async Button Demo".

## Installation

The component is already integrated into the project. Simply import it:

```typescript
import { AsyncButton } from '@/playground/asyncButton';
```

## Basic Usage

```typescript
import React, { useState } from 'react';
import { AsyncButton } from '@/playground/asyncButton';

function MyComponent() {
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      await someAsyncOperation();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AsyncButton
      text="Send Message"
      state={isLoading ? 'pending' : 'idle'}
      onPress={handlePress}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **Required** | Button text content |
| `state` | `'idle' \| 'pending' \| 'success' \| 'error'` | `'idle'` | Current button state |
| `onPress` | `() => void` | **Required** | Press handler function |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'error'` | `'primary'` | Color scheme variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `disabled` | `boolean` | `false` | Whether button is disabled |

## States

### Idle
- Default state with variant-based styling
- Shows original text with play icon (hidden by default)
- Normal shadow and opacity

### Pending
- Loading state with blue color scheme
- Shows "Loading..." text with ActivityIndicator
- Enhanced shadow for floating effect
- Button is automatically disabled

### Success
- Success state with green color scheme
- Shows "Success" text with CircleCheck icon
- Auto-resets to idle after 1.5 seconds

### Error
- Error state with red color scheme
- Shows "Error" text with CircleX icon
- Auto-resets to idle after 1.5 seconds

## Variants

### Primary (`variant="primary"`)
- Indigo color scheme (`#6366F1`)
- Default variant for main actions

### Secondary (`variant="secondary"`)
- Gray color scheme (`#6B7280`)
- For secondary actions

### Success (`variant="success"`)
- Green color scheme (`#059669`)
- For positive actions

### Error (`variant="error"`)
- Red color scheme (`#DC2626`)
- For destructive actions

## Sizes

### Small (`size="sm"`)
- Compact padding and smaller text
- Icon size: 14px
- Text class: `text-xs`

### Medium (`size="md"`)
- Default balanced size
- Icon size: 16px
- Text class: `text-sm`

### Large (`size="lg"`)
- Larger padding and text
- Icon size: 20px
- Text class: `text-base`

## Advanced Examples

### Form Submission
```typescript
<AsyncButton
  text="Create Account"
  state={formState}
  variant="primary"
  size="lg"
  onPress={handleCreateAccount}
/>
```

### File Upload
```typescript
<AsyncButton
  text="Upload Document"
  state={uploadState}
  variant="secondary"
  size="md"
  onPress={handleUpload}
/>
```

### Delete Action
```typescript
<AsyncButton
  text="Delete Item"
  state={deleteState}
  variant="error"
  size="sm"
  onPress={handleDelete}
/>
```

### Payment Processing
```typescript
<AsyncButton
  text="Process Payment"
  state={paymentState}
  variant="success"
  size="lg"
  onPress={handlePayment}
/>
```

## Animation Details

The component features several smooth animations:

1. **State Transition**: When state changes, the current text slides up and fades out
2. **Width Resize**: Button width animates to accommodate new text length
3. **Text Entrance**: New text slides down and fades in from bottom
4. **Press Feedback**: Scale animation (0.95x) on press for tactile feedback
5. **Shadow Effects**: Dynamic shadow intensity based on state

## Haptic Feedback

The component provides rich haptic feedback for enhanced user experience:

### Touch Feedback
- **Press In**: Light impact when button is pressed down
- **Press Complete**: Medium impact when action is confirmed
- **Smart Detection**: No feedback when button is disabled or in pending state

### State Notifications
- **Success State**: Success notification haptic when operation completes successfully
- **Error State**: Error notification haptic when operation fails
- **Automatic Triggering**: Haptics fire automatically on state changes

### Haptic Types
```typescript
// Touch interactions
Haptics.ImpactFeedbackStyle.Light    // On press in
Haptics.ImpactFeedbackStyle.Medium   // On press complete

// State notifications  
Haptics.NotificationFeedbackType.Success  // Success state
Haptics.NotificationFeedbackType.Error    // Error state
```

Note: Haptic feedback requires a physical device and won't work in simulators.

## Styling

The component uses Tailwind CSS classes for styling:
- Responsive padding based on size
- Dynamic border radius and shadow
- Consistent typography scaling
- Theme-aware color schemes

## Performance

Built with React Native Reanimated v3 for optimal performance:
- All animations run on the UI thread
- Smooth 60fps animations
- Efficient state management
- Minimal re-renders

## Dependencies

- React Native Reanimated
- Expo Haptics (for haptic feedback)
- Lucide React Native (for icons)
- NativeWind (for Tailwind CSS)

## Browser Compatibility
