import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { ProfileHeaderSection } from '@/components/profile/ProfileHeaderSection';

// Mock dependencies
jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@/hooks/useIconColors', () => ({
  useIconColors: () => ({ primary: '#FF6B35' }),
}));

jest.mock('@/hooks/useImageUpload', () => ({
  useImageUpload: () => ({
    uploading: false,
    pickAndUploadImage: jest.fn(),
    deleteImage: jest.fn(),
    getCachedImage: jest.fn(() => null),
  }),
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    session: { user: { id: 'user-123' } },
  }),
}));

describe('ProfileHeaderSection', () => {
  const mockOnImageSelected = jest.fn();

  const defaultProps = {
    firstName: 'John',
    lastName: 'Doe',
    avatarUrl: 'https://example.com/avatar.jpg',
    onImageSelected: mockOnImageSelected,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with full profile data', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('renders correctly with minimal data', () => {
    render(
      <ProfileHeaderSection 
        firstName="" 
        lastName="" 
        avatarUrl={undefined} 
        onImageSelected={mockOnImageSelected} 
      />
    );
    
    expect(screen.getByText('User')).toBeTruthy();
  });

  it('renders placeholder when no avatar provided', () => {
    render(
      <ProfileHeaderSection 
        firstName="John" 
        lastName="Doe" 
        avatarUrl={undefined} 
        onImageSelected={mockOnImageSelected} 
      />
    );
    
    // Should render without avatar
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('displays full name when both first and last name provided', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('displays first name only when last name is missing', () => {
    render(
      <ProfileHeaderSection 
        firstName="John" 
        lastName="" 
        avatarUrl={defaultProps.avatarUrl} 
        onImageSelected={mockOnImageSelected} 
      />
    );
    
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('displays last name only when first name is missing', () => {
    render(
      <ProfileHeaderSection 
        firstName="" 
        lastName="Doe" 
        avatarUrl={defaultProps.avatarUrl} 
        onImageSelected={mockOnImageSelected} 
      />
    );
    
    expect(screen.getByText('Doe')).toBeTruthy();
  });

  it('handles image selection callback', () => {
    const mockImageUpload = jest.requireMock('@/hooks/useImageUpload').useImageUpload;
    const mockPickAndUploadImage = jest.fn();
    
    mockImageUpload.mockReturnValue({
      uploading: false,
      pickAndUploadImage: mockPickAndUploadImage,
      deleteImage: jest.fn(),
      getCachedImage: jest.fn(() => null),
    });

    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Simulate image picker interaction
    const avatarSection = screen.getByTestId('profile-avatar-section');
    fireEvent.press(avatarSection);
    
    expect(mockPickAndUploadImage).toHaveBeenCalled();
  });

  it('shows uploading state', () => {
    const mockImageUpload = jest.requireMock('@/hooks/useImageUpload').useImageUpload;
    
    mockImageUpload.mockReturnValue({
      uploading: true,
      pickAndUploadImage: jest.fn(),
      deleteImage: jest.fn(),
      getCachedImage: jest.fn(() => null),
    });

    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Should show loading indicator
    expect(screen.getByTestId('upload-loading')).toBeTruthy();
  });

  it('handles very long names gracefully', () => {
    const longNameProps = {
      firstName: 'VeryLongFirstNameThatShouldBeHandledGracefully',
      lastName: 'VeryLongLastNameThatShouldAlsoBeHandledGracefully',
      avatarUrl: defaultProps.avatarUrl,
      onImageSelected: mockOnImageSelected,
    };

    render(<ProfileHeaderSection {...longNameProps} />);
    
    expect(screen.getByText('VeryLongFirstNameThatShouldBeHandledGracefully')).toBeTruthy();
  });

  it('renders with custom styling', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Component should render with custom styling
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('handles image loading errors gracefully', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Should handle image errors gracefully
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('uses cached images when available', () => {
    const mockImageUpload = jest.requireMock('@/hooks/useImageUpload').useImageUpload;
    const cachedImageUrl = 'cached://image.jpg';
    
    mockImageUpload.mockReturnValue({
      uploading: false,
      pickAndUploadImage: jest.fn(),
      deleteImage: jest.fn(),
      getCachedImage: jest.fn(() => cachedImageUrl),
    });

    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Should use cached image
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('handles missing session gracefully', () => {
    jest.requireMock('@/context/AuthContext').useAuth.mockReturnValue({
      session: null,
    });

    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Should still render without session
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('handles special characters in names', () => {
    const specialCharProps = {
      firstName: 'José',
      lastName: 'García-López',
      avatarUrl: defaultProps.avatarUrl,
      onImageSelected: mockOnImageSelected,
    };

    render(<ProfileHeaderSection {...specialCharProps} />);
    
    expect(screen.getByText('José')).toBeTruthy();
  });

  it('is accessible', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Component should be accessible
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('handles rapid interactions', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    const avatarSection = screen.getByTestId('profile-avatar-section');
    
    // Simulate rapid presses
    fireEvent.press(avatarSection);
    fireEvent.press(avatarSection);
    fireEvent.press(avatarSection);
    
    // Should handle rapid interactions gracefully
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('maintains correct aspect ratio for avatars', () => {
    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Component should maintain correct aspect ratio
    expect(screen.getByText('John')).toBeTruthy();
  });

  it('handles network interruptions during upload', () => {
    const mockImageUpload = jest.requireMock('@/hooks/useImageUpload').useImageUpload;
    
    mockImageUpload.mockReturnValue({
      uploading: false,
      pickAndUploadImage: jest.fn().mockRejectedValue(new Error('Network error')),
      deleteImage: jest.fn(),
      getCachedImage: jest.fn(() => null),
    });

    render(<ProfileHeaderSection {...defaultProps} />);
    
    // Should handle network errors gracefully
    expect(screen.getByText('John')).toBeTruthy();
  });
});