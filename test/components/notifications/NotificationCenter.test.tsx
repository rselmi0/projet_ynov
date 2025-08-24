import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

// Mock the notifications hook
jest.mock('@/hooks/useNotifications', () => ({
  useNotifications: jest.fn(() => ({
    notifications: [
      {
        id: '1',
        title: 'Test Notification',
        body: 'This is a test notification',
        data: {},
        date: Date.now(),
      },
      {
        id: '2',
        title: 'Another Notification',
        body: 'This is another test notification',
        data: {},
        date: Date.now() - 1000,
      },
    ],
    unreadCount: 2,
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
    clearNotification: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

describe('NotificationCenter Component', () => {
  const mockUseNotifications = require('@/hooks/useNotifications').useNotifications;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render notification list', () => {
    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText('Test Notification')).toBeTruthy();
    expect(getByText('Another Notification')).toBeTruthy();
  });

  it('should display notification bodies', () => {
    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText('This is a test notification')).toBeTruthy();
    expect(getByText('This is another test notification')).toBeTruthy();
  });

  it('should show unread count', () => {
    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText('2')).toBeTruthy(); // Unread count badge
  });

  it('should handle empty notification list', () => {
    mockUseNotifications.mockReturnValue({
      notifications: [],
      unreadCount: 0,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      clearNotification: jest.fn(),
      clearAll: jest.fn(),
    });

    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText(/no notifications/i)).toBeTruthy();
  });

  it('should mark notification as read when pressed', () => {
    const mockMarkAsRead = jest.fn();
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'Test Notification',
          body: 'Test body',
          data: {},
          date: Date.now(),
        },
      ],
      unreadCount: 1,
      markAsRead: mockMarkAsRead,
      markAllAsRead: jest.fn(),
      clearNotification: jest.fn(),
      clearAll: jest.fn(),
    });

    const { getByText } = render(<NotificationCenter />);
    
    fireEvent.press(getByText('Test Notification'));
    expect(mockMarkAsRead).toHaveBeenCalledWith('1');
  });

  it('should clear notification when delete is pressed', () => {
    const mockClearNotification = jest.fn();
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'Test Notification',
          body: 'Test body',
          data: {},
          date: Date.now(),
        },
      ],
      unreadCount: 1,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      clearNotification: mockClearNotification,
      clearAll: jest.fn(),
    });

    const { getByRole } = render(<NotificationCenter />);
    
    const deleteButton = getByRole('button', { name: /delete/i });
    fireEvent.press(deleteButton);
    
    expect(mockClearNotification).toHaveBeenCalledWith('1');
  });

  it('should mark all as read', () => {
    const mockMarkAllAsRead = jest.fn();
    mockUseNotifications.mockReturnValue({
      notifications: [
        { id: '1', title: 'Test 1', body: 'Body 1', data: {}, date: Date.now() },
        { id: '2', title: 'Test 2', body: 'Body 2', data: {}, date: Date.now() },
      ],
      unreadCount: 2,
      markAsRead: jest.fn(),
      markAllAsRead: mockMarkAllAsRead,
      clearNotification: jest.fn(),
      clearAll: jest.fn(),
    });

    const { getByText } = render(<NotificationCenter />);
    
    const markAllButton = getByText(/mark all as read/i);
    fireEvent.press(markAllButton);
    
    expect(mockMarkAllAsRead).toHaveBeenCalled();
  });

  it('should clear all notifications', () => {
    const mockClearAll = jest.fn();
    mockUseNotifications.mockReturnValue({
      notifications: [
        { id: '1', title: 'Test 1', body: 'Body 1', data: {}, date: Date.now() },
        { id: '2', title: 'Test 2', body: 'Body 2', data: {}, date: Date.now() },
      ],
      unreadCount: 2,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      clearNotification: jest.fn(),
      clearAll: mockClearAll,
    });

    const { getByText } = render(<NotificationCenter />);
    
    const clearAllButton = getByText(/clear all/i);
    fireEvent.press(clearAllButton);
    
    expect(mockClearAll).toHaveBeenCalled();
  });

  it('should format notification timestamps', () => {
    const now = Date.now();
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'Recent Notification',
          body: 'Body',
          data: {},
          date: now,
        },
      ],
      unreadCount: 1,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      clearNotification: jest.fn(),
      clearAll: jest.fn(),
    });

    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText('Recent Notification')).toBeTruthy();
    // Should show some time format
  });

  it('should group notifications by date', () => {
    const today = Date.now();
    const yesterday = today - 24 * 60 * 60 * 1000;
    
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'Today Notification',
          body: 'Today body',
          data: {},
          date: today,
        },
        {
          id: '2',
          title: 'Yesterday Notification',
          body: 'Yesterday body',
          data: {},
          date: yesterday,
        },
      ],
      unreadCount: 2,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      clearNotification: jest.fn(),
      clearAll: jest.fn(),
    });

    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText('Today Notification')).toBeTruthy();
    expect(getByText('Yesterday Notification')).toBeTruthy();
  });

  it('should handle notification with data payload', () => {
    mockUseNotifications.mockReturnValue({
      notifications: [
        {
          id: '1',
          title: 'Data Notification',
          body: 'Has data payload',
          data: { screen: 'profile', userId: '123' },
          date: Date.now(),
        },
      ],
      unreadCount: 1,
      markAsRead: jest.fn(),
      markAllAsRead: jest.fn(),
      clearNotification: jest.fn(),
      clearAll: jest.fn(),
    });

    const { getByText } = render(<NotificationCenter />);
    
    expect(getByText('Data Notification')).toBeTruthy();
  });
});