/**
 * Profile-related type definitions
 */

// User profile data structure (renamed to avoid conflict with stores.d.ts)
export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

// Profile update data
export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

// Profile header section props
export interface ProfileHeaderSectionProps {
  firstName: string;
  lastName: string;
  avatarUrl: string | undefined;
  onImageSelected: (imageUri: string) => void;
}

// Profile info section props
export interface ProfileInfoSectionProps {
  email: string | undefined;
  memberSince: string;
}

// Profile status section props
export interface ProfileStatusSectionProps {
  isPaidUser: boolean;
  isPremiumUser: boolean;
  isProfileComplete: boolean;
}

// Edit field modal props
export interface EditFieldModalProps {
  visible: boolean;
  onClose: () => void;
  fieldType: 'firstName' | 'lastName' | 'avatarUrl';
  currentValue: string;
  onSave: (value: string) => void;
  onAutoSave: (value: string) => void;
}

// Field configuration for edit modal
export interface FieldConfig {
  title: string;
  placeholder: string;
  autoCapitalize: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
}

// Modal state for editing fields
export interface EditModalState {
  visible: boolean;
  field: 'firstName' | 'lastName';
  currentValue: string;
}

// Profile completion status
export interface ProfileCompletionStatus {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
}

// Image selection source
export type ImageSource = 'gallery' | 'camera';

// Profile field types
export type ProfileFieldType = 'firstName' | 'lastName' | 'avatarUrl' | 'email';

// Profile actions
export interface ProfileActions {
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
  deleteProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  is_paid: boolean;
  is_premium: boolean;
  expo_push_token?: string;
  push_notifications_enabled: boolean;
  email_notifications_enabled: boolean;
  marketing_notifications_enabled: boolean;
  onboarding_completed?: boolean;
  lang: string;
  created_at: string;
  updated_at?: string;
  stripe_customer_id?: string;
}

// Profile update input type - properly extends Partial<Profile> but excludes readonly fields
export type ProfileUpdateInput = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>; 