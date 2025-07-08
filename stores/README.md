# Zustand Stores

## ProfileStore

The `profileStore` manages user profile state with Zustand, using Supabase's `users` table.

### Profile Structure (users Table)

```typescript
interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  is_paid: boolean;
  is_premium: boolean;
  created_at: string;
  updated_at?: string;
}
```

### Usage

#### Custom Hook (recommended)
```typescript
import { useProfile } from '../hooks/useProfile';

function MyComponent() {
  const { 
    profile, 
    loading, 
    error, 
    updateFullName, 
    isProfileComplete,
    isPaidUser,
    isPremiumUser,
    updatePaidStatus,
    updatePremiumStatus
  } = useProfile();

  return (
    <View>
      <Text>{profile?.full_name}</Text>
      <Text>Status: {isPaidUser ? 'Paid' : 'Free'}</Text>
      <Button onPress={() => updateFullName("New name")} />
      <Button onPress={() => updatePaidStatus(true)} />
    </View>
  );
}
```

#### Direct Store
```typescript
import { useProfileStore } from '../stores/profileStore';

function MyComponent() {
  const { profile, fetchProfile, updateProfile } = useProfileStore();
  
  useEffect(() => {
    fetchProfile(userId);
  }, []);
}
```

### Available Actions

- `fetchProfile(userId)` - Fetch profile from Supabase (users table)
- `updateProfile(updates)` - Update profile
- `clearProfile()` - Clear profile (used during logout)
- `setProfile(profile)` - Set profile directly
- `updateFullName(name)` - Update full name
- `updateAvatar(url)` - Update avatar
- `updatePaidStatus(isPaid)` - Update payment status
- `updatePremiumStatus(isPremium)` - Update premium status

### Available Helpers

- `isProfileComplete` - Check if profile is complete (name filled)
- `isPaidUser` - Check if user has paid
- `isPremiumUser` - Check if user is premium

### AuthContext Integration

The store is automatically integrated with `AuthContext`:
- **Login** → Automatic profile retrieval
- **Logout** → Automatic profile clearing
- **Signup** → Profile creation and retrieval

### Supabase Configuration

The `users` table already exists. To add profile fields, run:

```sql
-- Execute the file supabase/migrations/add-profile-fields.sql
```

This migration adds:
- `full_name` (TEXT)
- `avatar_url` (TEXT) 
- `updated_at` (TIMESTAMP)
- RLS policies for UPDATE and INSERT
- Trigger for `updated_at`
- Automatic profile creation function

### Features

- ✅ State management with Zustand
- ✅ Automatic Supabase integration (users table)
- ✅ Automatic profile creation during signup
- ✅ Payment and premium status management
- ✅ Real-time updates
- ✅ Error handling
- ✅ Loading states
- ✅ Full TypeScript support 