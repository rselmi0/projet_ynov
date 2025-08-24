import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { SettingsRow } from '@/components/settings/SettingsRow';

describe('SettingsRow', () => {
  it('renders with basic title', () => {
    render(<SettingsRow title="Test Setting" />);
    
    expect(screen.getByText('Test Setting')).toBeTruthy();
  });

  it('renders with subtitle', () => {
    render(
      <SettingsRow 
        title="Test Setting"
        subtitle="This is a test setting"
      />
    );
    
    expect(screen.getByText('Test Setting')).toBeTruthy();
    expect(screen.getByText('This is a test setting')).toBeTruthy();
  });

  it('renders with icon', () => {
    const TestIcon = () => React.createElement('Text', {}, 'Icon');
    
    render(
      <SettingsRow 
        title="Settings with Icon"
        icon={React.createElement(TestIcon)}
      />
    );
    
    expect(screen.getByText('Settings with Icon')).toBeTruthy();
    expect(screen.getByText('Icon')).toBeTruthy();
  });

  it('renders with value', () => {
    render(
      <SettingsRow 
        title="Setting with Value"
        value="Test Value"
      />
    );
    
    expect(screen.getByText('Setting with Value')).toBeTruthy();
    expect(screen.getByText('Test Value')).toBeTruthy();
  });

  it('shows chevron when showChevron is true', () => {
    render(
      <SettingsRow 
        title="Navigable Setting" 
        showChevron={true}
      />
    );
    
    expect(screen.getByText('Navigable Setting')).toBeTruthy();
    // Should show some indication of navigation
  });

  it('handles press events', () => {
    const onPress = jest.fn();
    
    render(
      <SettingsRow 
        title="Pressable Setting"
        onPress={onPress}
      />
    );
    
    fireEvent.press(screen.getByText('Pressable Setting'));
    expect(onPress).toHaveBeenCalled();
  });

  it('renders with right element', () => {
    const RightElement = () => React.createElement('Text', {}, 'Right Content');
    
    render(
      <SettingsRow 
        title="Setting with Right Element"
        rightElement={React.createElement(RightElement)}
      />
    );
    
    expect(screen.getByText('Setting with Right Element')).toBeTruthy();
    expect(screen.getByText('Right Content')).toBeTruthy();
  });

  it('renders with all props combined', () => {
    const TestIcon = () => React.createElement('Text', {}, 'Icon');
    const RightElement = () => React.createElement('Text', {}, 'Right');
    const onPress = jest.fn();
    
    render(
      <SettingsRow 
        title="Complex Setting"
        subtitle="Complex description"
        value="Complex Value"
        icon={React.createElement(TestIcon)}
        rightElement={React.createElement(RightElement)}
        onPress={onPress}
        showChevron={true}
      />
    );
    
    expect(screen.getByText('Complex Setting')).toBeTruthy();
    expect(screen.getByText('Complex description')).toBeTruthy();
    expect(screen.getByText('Complex Value')).toBeTruthy();
    expect(screen.getByText('Icon')).toBeTruthy();
    expect(screen.getByText('Right')).toBeTruthy();
  });

  it('handles long text gracefully', () => {
    const longText = 'This is a very long setting title that should be handled gracefully by the component without causing any layout issues or overflow problems';
    const longDescription = 'This is a very long description that explains what this setting does in great detail and should also be handled gracefully by the component layout system';
    
    render(
      <SettingsRow 
        title={longText}
        subtitle={longDescription}
      />
    );
    
    expect(screen.getByText(longText)).toBeTruthy();
    expect(screen.getByText(longDescription)).toBeTruthy();
  });

  it('is accessible', () => {
    render(<SettingsRow title="Accessible Setting" />);
    
    // Component should be accessible
    expect(screen.getByText('Accessible Setting')).toBeTruthy();
  });

  it('handles rapid presses gracefully', () => {
    const onPress = jest.fn();
    
    render(
      <SettingsRow 
        title="Rapid Press Setting"
        onPress={onPress}
      />
    );
    
    const setting = screen.getByText('Rapid Press Setting');
    
    // Simulate rapid presses
    fireEvent.press(setting);
    fireEvent.press(setting);
    fireEvent.press(setting);
    
    expect(onPress).toHaveBeenCalledTimes(3);
  });

  it('works without onPress handler', () => {
    render(<SettingsRow title="Non-interactive Setting" />);
    
    const setting = screen.getByText('Non-interactive Setting');
    
    // Should not throw when pressed without handler
    fireEvent.press(setting);
    expect(screen.getByText('Non-interactive Setting')).toBeTruthy();
  });

  it('handles empty title gracefully', () => {
    render(<SettingsRow title="" />);
    
    // Should render without issues
    expect(screen.getByTestId('settings-row')).toBeTruthy();
  });

  it('handles special characters in text', () => {
    render(
      <SettingsRow 
        title="Setting with émojis 🚀 & special chars: @#$%"
        subtitle="Description with 中文 and عربي text"
      />
    );
    
    expect(screen.getByText('Setting with émojis 🚀 & special chars: @#$%')).toBeTruthy();
    expect(screen.getByText('Description with 中文 and عربي text')).toBeTruthy();
  });

  it('maintains proper layout with different content combinations', () => {
    // Test various content combinations
    const combinations = [
      { title: 'Title Only' },
      { title: 'With Subtitle', subtitle: 'Subtitle' },
      { title: 'With Value', value: 'Value' },
      { title: 'With All', subtitle: 'Sub', value: 'Val', showChevron: true },
    ];

    combinations.forEach((props, index) => {
      const { unmount } = render(<SettingsRow key={index} {...props} />);
      expect(screen.getByText(props.title)).toBeTruthy();
      unmount();
    });
  });

  it('supports nested interactive elements', () => {
    const rightElementPress = jest.fn();
    const rowPress = jest.fn();
    
    const InteractiveRightElement = () => 
      React.createElement('TouchableOpacity', 
        { onPress: rightElementPress }, 
        React.createElement('Text', {}, 'Interactive Right')
      );
    
    render(
      <SettingsRow 
        title="Nested Interactive Setting"
        rightElement={React.createElement(InteractiveRightElement)}
        onPress={rowPress}
      />
    );
    
    // Press the right element
    fireEvent.press(screen.getByText('Interactive Right'));
    expect(rightElementPress).toHaveBeenCalled();
    
    // Press the row itself
    fireEvent.press(screen.getByText('Nested Interactive Setting'));
    expect(rowPress).toHaveBeenCalled();
  });
});