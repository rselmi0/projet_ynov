import { ImageSourcePropType } from 'react-native';

// Interface for main payment button
export interface PaymentButtonProps {
  title: string;
  subtitle: string;
  imageSource: ImageSourcePropType;
  onPress: () => void;
  loading?: boolean;
  className?: string;
  imageBackgroundColor?: string;
}

// Interface for PaymentSheet component
export interface PaymentSheetProps {
  className?: string;
  amount?: number;
  currency?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Interface for simple Stripe payment button
export interface PayNowButtonProps {
  className?: string;
}

// Types for loading states of different payment modes
export interface PaymentLoadingStates {
  stripeRedirect: boolean;
  stripeInApp: boolean;
  revenueCat: boolean;
}

// Types for Stripe API responses
export interface StripeCheckoutResponse {
  url: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  customer_id: string;
}

// Types for payment method comparison data
export interface PaymentComparisonFeature {
  feature: string;
  stripe: boolean | string;
  revenueCat: boolean | string;
}

export interface PaymentProviderLogo {
  name: string;
  source: ImageSourcePropType;
  backgroundColor: string;
}

// Types for payment errors
export interface PaymentError {
  code?: string;
  message: string;
}

// Types for Stripe PaymentSheet configuration
export interface StripePaymentSheetConfig {
  merchantDisplayName: string;
  paymentIntentClientSecret: string;
  customerId?: string;
  applePay?: {
    merchantCountryCode: string;
  };
  googlePay?: {
    merchantCountryCode: string;
    currencyCode: string;
    testEnv: boolean;
  };
  allowsDelayedPaymentMethods: boolean;
  defaultBillingDetails: {
    name: string;
  };
  returnURL: string;
} 