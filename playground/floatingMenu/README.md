# ExpandableFloatingButton Component

A draggable floating button component for React Native that morphs into an expandable menu, similar to Apple's AssistiveTouch. The component features smooth morphing animations, persistent positioning with Zustand, and customizable content.

## Features

- 🎯 **Draggable**: Move the floating button anywhere on the screen (when collapsed)
- 📱 **Auto-snap**: Automatically snaps to screen edges for better UX
- 💾 **Persistent**: Position and state saved using Zustand with async storage
- 🎨 **Customizable**: Full control over appearance and content
- ⚡ **Smooth morphing**: The button itself transforms into the menu container
- 📱 **Responsive**: Adapts to different screen sizes and orientations
- 👆 **Touch-friendly**: Tap to open/close, drag to move when collapsed

## Components

### `ExpandableFloatingButton`
Main component that morphs from a circular button into a rounded rectangle menu.

```tsx
import { ExpandableFloatingButton } from './playground/floatingMenu';

<ExpandableFloatingButton
  size={56}
  expandedWidth={340}
  expandedHeight={380}
  onToggle={(isExpanded) => console.log('Menu toggled:', isExpanded)}
>
  {/* Your custom content here */}
</ExpandableFloatingButton>
```

### `useFloatingMenuStore` Hook
Zustand store for state management and programmatic control.

```tsx
import { useFloatingMenuStore } from './playground/floatingMenu';

const store = useFloatingMenuStore();

// Available methods:
store.toggleExpanded();     // Toggle open/closed state
store.setExpanded(true);    // Open the menu
store.setExpanded(false);   // Close the menu
store.resetPosition();      // Reset to default position

// Available state:
store.isExpanded           // Current expanded state
store.position            // Current button position
store.isDragging         // Current dragging state
```

## Props

### ExpandableFloatingButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display in the expanded menu |
| `size` | `number` | `56` | Size of the floating button in pixels (when collapsed) |
| `expandedWidth` | `number` | `320` | Width of the expanded menu |
| `expandedHeight` | `number` | `350` | Height of the expanded menu |
| `onToggle` | `() => void` | - | Callback when menu is toggled |

## Usage Examples

### Basic Usage

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { ExpandableFloatingButton } from './playground/floatingMenu';

export const MyApp = () => {
  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      
      <ExpandableFloatingButton>
        <Text style={{ color: 'white', padding: 16 }}>
          Hello from floating menu!
        </Text>
      </ExpandableFloatingButton>
    </View>
  );
};
```

### Advanced Usage with Custom Actions

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ExpandableFloatingButton, useFloatingMenuStore } from './playground/floatingMenu';
import { Home, Settings, Bell } from 'lucide-react-native';

export const MyApp = () => {
  const store = useFloatingMenuStore();

  const handleAction = (action: string) => {
    console.log('Action:', action);
    store.setExpanded(false); // Close menu after action
  };

  return (
    <View style={{ flex: 1 }}>
      <ExpandableFloatingButton
        expandedWidth={340}
        expandedHeight={300}
      >
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Quick Actions
          </Text>
          
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}
            onPress={() => handleAction('home')}
          >
            <Home size={20} color="white" />
            <Text style={{ color: 'white' }}>Go Home</Text>
          </Pressable>
          
          <Pressable
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12 }}
            onPress={() => handleAction('settings')}
          >
            <Settings size={20} color="white" />
            <Text style={{ color: 'white' }}>Settings</Text>
          </Pressable>
        </View>
      </ExpandableFloatingButton>
    </View>
  );
};
```

### Programmatic Control

```tsx
import { useFloatingMenuStore } from './playground/floatingMenu';

const MyComponent = () => {
  const store = useFloatingMenuStore();

  // Open menu programmatically
  const openMenu = () => {
    store.setExpanded(true);
  };

  // Close menu programmatically  
  const closeMenu = () => {
    store.setExpanded(false);
  };

  // Toggle menu
  const toggleMenu = () => {
    store.toggleExpanded();
  };

  // Check current state
  const isOpen = store.isExpanded;
  const position = store.position;
  const isDragging = store.isDragging;

  return (
    // Your component JSX
  );
};
```

## How It Works

The component uses a unique morphing approach where the button itself transforms into the menu:

### When Collapsed (Button Mode):
- Circular button with Plus icon
- Draggable around the screen
- Tap to expand into menu

### When Expanded (Menu Mode):
- Button morphs into rounded rectangle
- Content appears inside the expanded area
- X button in top-right corner to close
- Repositioned to fit on screen with proper margins

## Animation Details

The floating button uses several types of smooth animations:

- **Morphing**: Button smoothly transforms from circle to rounded rectangle
- **Position**: Spring animations when repositioning for expansion
- **Scale**: Button scales slightly when dragging starts  
- **Rotation**: Plus icon rotates to X when menu expands
- **Content**: Smooth fade-in/out of menu content

## State Management

The component uses Zustand for state management with these features:

- **Persistent storage**: Position is saved and restored between app sessions
- **Automatic edge snapping**: Button snaps to nearest screen edge when released
- **Boundary constraints**: Button can't be dragged outside screen bounds
- **State synchronization**: All interactions update the centralized store

## Gesture Handling

### Touch Interactions:
- **Tap**: Toggle between button and menu modes
- **Drag**: Move the button around (only when collapsed)
- **Background tap**: Close menu when expanded

### Implementation:
- Uses `TouchableOpacity` for tap detection
- Uses `PanGestureHandler` for drag functionality
- Smart gesture recognition prevents conflicts

## File Structure

```
playground/floatingMenu/
├── index.ts                           # Main exports
├── ExpandableFloatingButton.tsx       # Main morphing component
├── ExpandableFloatingButtonDemo.tsx   # Demo implementation
├── floatingMenuStore.ts              # Zustand store
└── README.md                         # This documentation
```

## Demo

See `ExpandableFloatingButtonDemo.tsx` for a complete example showing:
- Custom menu actions with icons
- Proper touch handling
- State monitoring
- Custom styling

## Dependencies

- `zustand` - State management
- `react-native-reanimated` - Smooth animations
- `react-native-gesture-handler` - Gesture handling for dragging
- `@react-native-async-storage/async-storage` - Position persistence
- `lucide-react-native` - Icons (demo only)

## Notes

- The component automatically handles safe areas and screen boundaries
- Position is persisted across app restarts
- Menu automatically repositions when expanded to fit on screen
- Button snaps to edges for better UX and screen space optimization
- Uses React Reanimated for 60fps animations
- TouchableOpacity ensures reliable tap detection 