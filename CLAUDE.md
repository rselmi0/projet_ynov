# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm start` or `expo start`
- **Run on iOS**: `npm run ios` or `expo run:ios`
- **Run on Android**: `npm run android` or `expo run:android`
- **Web development**: `npm run web` or `expo start --web`
- **Prebuild**: `npm run prebuild` or `expo prebuild`
- **Lint and format check**: `npm run lint`
- **Format code**: `npm run format`
- **Initialize project**: `npm run init`
- **Run tests**: `npm test`
- **Run tests in watch mode**: `npm run test:watch`
- **Run tests with coverage**: `npm run test:coverage`

## Architecture Overview

This is an Expo-based React Native application built with TypeScript, featuring:

### Core Technologies
- **Expo Router** for file-based navigation with stack navigation
- **Supabase** for backend services (auth, database, edge functions)
- **React Query (@tanstack/react-query)** for data fetching and caching with MMKV persistence
- **Zustand** for local state management
- **NativeWind (Tailwind CSS)** for styling
- **TypeScript** with strict mode enabled

### Project Structure
- `app/` - Expo Router pages with nested layouts
  - `(auth)/` - Authentication screens (sign-in, sign-up, welcome, reset password)
  - `(protected)/(tabs)/` - Main app tabs (index, ai, tasks, notifications, etc.)
  - `onboarding/` - User onboarding flow
- `components/` - Organized by feature domains (ai, auth, payment, ui, etc.)
- `context/` - React contexts (Auth, Theme, RevenueCat, Stripe)
- `hooks/` - Custom React hooks
- `stores/` - Zustand stores for local state
- `supabase/functions/` - Supabase Edge Functions (Deno/TypeScript)
- `types/` - TypeScript type definitions organized by domain

### Key Features
- **Authentication**: Supabase auth with email, Google Sign-In, and Apple Sign-In
- **Premium subscriptions**: RevenueCat integration for in-app purchases
- **Payment processing**: Stripe integration
- **AI chat functionality**: OpenAI integration via Supabase Edge Functions
- **Internationalization**: i18next with locale support (en, es, fr, pt)
- **Theme system**: Light/dark mode with CSS variables
- **Offline support**: MMKV storage with React Query persistence
- **Push notifications**: Expo notifications
- **Error tracking**: Sentry integration

### Navigation Structure
- Unauthenticated: `/` → `welcome` → `sign-in`/`sign-up` → `onboarding`
- Authenticated: `(protected)/(tabs)` with bottom tab navigation

### Import Paths
- Uses `@/*` alias pointing to project root
- Barrel exports in component directories via `index.ts` files

### Styling Conventions
- NativeWind (Tailwind CSS) for styling
- CSS variables for theme support in `global.css`
- Custom UI components in `components/ui/` following shadcn/ui patterns

### Data Layer
- Supabase for backend (auth, database, storage, edge functions)
- React Query for server state with offline persistence
- Zustand stores for client-only state (onboarding, profile, offline data)

## Development Notes

- All comments must be in English
- Follow existing code patterns and component structure
- Use TypeScript strict mode
- Leverage existing UI components before creating new ones
- Follow the established folder organization by feature domains