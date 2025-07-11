// linking.ts
import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      index: '/',
      '+not-found': '*',
      
      // Auth routes (in (auth) folder)
      '(auth)': {
        path: '/auth',
        screens: {
          welcome: '/welcome',
          'sign-in': '/sign-in',
          'sign-up': '/sign-up',
          resetPassword: '/reset-password',
        },
      },
      
      // Onboarding routes
      onboarding: {
        path: '/onboarding',
        screens: {
          index: '',
          step1: '/step1',
          step2: '/step2',
          step3: '/step3',
        },
      },
      
      // Protected routes
      '(protected)': {
        path: '/app',
        screens: {
          // Tabs within protected routes
          '(tabs)': {
            path: '',
            screens: {
              index: '/',
              profile: '/profile',
              settings: '/settings',
              ai: '/ai',
              tasks: '/tasks',
              payment: '/payment',
              offline: '/offline',
              playground: '/playground',
            },
          },
          // Other protected pages
          premium: '/premium',
          'privacy-policy': '/privacy-policy',
          'terms-of-service': '/terms',
        },
      },
    },
  },
};
