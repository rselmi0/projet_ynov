import { User, Settings, Bot, CreditCard, Zap, Shield, Sparkles } from 'lucide-react-native';

export interface QuickAction {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: any;
  route: string;
  color: string;
}

export const quickActions: QuickAction[] = [
  {
    key: 'profile',
    titleKey: 'quickActions.profile.title',
    descriptionKey: 'quickActions.profile.description',
    icon: User,
    route: '/(protected)/(tabs)/profile',
    color: '#3B82F6',
  },
  {
    key: 'settings',
    titleKey: 'quickActions.settings.title',
    descriptionKey: 'quickActions.settings.description',
    icon: Settings,
    route: '/(protected)/(tabs)/settings',
    color: '#6B7280',
  },
  {
    key: 'ai',
    titleKey: 'quickActions.ai.title',
    descriptionKey: 'quickActions.ai.description',
    icon: Bot,
    route: '/(protected)/(tabs)/ai',
    color: '#10B981',
  },
  {
    key: 'payment',
    titleKey: 'quickActions.payment.title',
    descriptionKey: 'quickActions.payment.description',
    icon: CreditCard,
    route: '/(protected)/(tabs)/payment',
    color: '#F59E0B',
  },
];

export interface Feature {
  key: string;
  titleKey: string;
  descriptionKey: string;
  icon: any;
  color: string;
}

export const features: Feature[] = [
  {
    key: 'fast',
    titleKey: 'features.fast.title',
    descriptionKey: 'features.fast.description',
    icon: Zap,
    color: '#F59E0B',
  },
  {
    key: 'secure',
    titleKey: 'features.secure.title',
    descriptionKey: 'features.secure.description',
    icon: Shield,
    color: '#10B981',
  },
  {
    key: 'ai',
    titleKey: 'features.ai.title',
    descriptionKey: 'features.ai.description',
    icon: Sparkles,
    color: '#8B5CF6',
  },
]; 