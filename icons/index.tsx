import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  Home,
  User,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  CreditCard,
  Star,
  LogOut,
  Edit,
  Check,
  X,
  Plus,
  Search,
  MoreHorizontal,
  Languages,
  CheckSquare,
  Menu,
  Bot,
  HelpCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  Trash2,
  Edit3,
  Download,
  Share,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  UserCircle,
  DollarSign,
  Crown,
  ShoppingCart,
  Key,
  Send,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Maximize,
  Minimize,
  Target,
  Award,
  Badge,
  Camera,
  Image,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Filter,
  SortAsc,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Archive,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  FileText,
  Folder,
  FolderOpen,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
} from 'lucide-react-native';
import { useIconColors } from '@/hooks/useIconColors';

// Types for icon props
export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
}

// Custom Apple Icon component
const AppleIcon: React.FC<IconProps> = ({ size = 20, color = '#000000', ...props }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Path
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
        fill={color}
      />
    </Svg>
  </View>
);

// Custom Google Icon component
const GoogleIcon: React.FC<IconProps> = ({ size = 20, color = '#4285F4', ...props }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <Path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <Path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <Path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </Svg>
  </View>
);

// Icon components with default props
export const Icons = {
  // Navigation
  Home: (props: IconProps) => <Home size={24} color="#6B7280" strokeWidth={2} {...props} />,
  User: (props: IconProps) => <User size={24} color="#6B7280" strokeWidth={2} {...props} />,
  Settings: (props: IconProps) => <Settings size={24} color="#6B7280" strokeWidth={2} {...props} />,
  CheckSquare: (props: IconProps) => (
    <CheckSquare size={24} color="#6B7280" strokeWidth={2} {...props} />
  ),
  Menu: (props: IconProps) => <Menu size={24} color="#6B7280" strokeWidth={2} {...props} />,
  Bot: (props: IconProps) => <Bot size={24} color="#6B7280" strokeWidth={2} {...props} />,
  Play: (props: IconProps) => <Play size={24} color="#6B7280" strokeWidth={2} {...props} />,

  // Auth & Security
  Mail: (props: IconProps) => <Mail size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Lock: (props: IconProps) => <Lock size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Eye: (props: IconProps) => <Eye size={20} color="#6B7280" strokeWidth={2} {...props} />,
  EyeOff: (props: IconProps) => <EyeOff size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Shield: (props: IconProps) => <Shield size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Google: (props: IconProps) => <GoogleIcon {...props} />,
  Apple: (props: IconProps) => <AppleIcon {...props} />,

  // Theme & System
  Moon: (props: IconProps) => <Moon size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Sun: (props: IconProps) => <Sun size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Globe: (props: IconProps) => <Globe size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Languages: (props: IconProps) => (
    <Languages size={20} color="#6B7280" strokeWidth={2} {...props} />
  ),

  // Notifications & Actions
  Bell: (props: IconProps) => <Bell size={20} color="#6B7280" strokeWidth={2} {...props} />,
  LogOut: (props: IconProps) => <LogOut size={20} color="#EF4444" strokeWidth={2} {...props} />,
  Edit: (props: IconProps) => <Edit size={20} color="#6B7280" strokeWidth={2} {...props} />,
  CreditCard: (props: IconProps) => (
    <CreditCard size={20} color="#6B7280" strokeWidth={2} {...props} />
  ),

  // UI Elements
  ChevronRight: (props: IconProps) => (
    <ChevronRight size={16} color="#9CA3AF" strokeWidth={2} {...props} />
  ),
  Check: (props: IconProps) => <Check size={16} color="#10B981" strokeWidth={2} {...props} />,
  X: (props: IconProps) => <X size={16} color="#EF4444" strokeWidth={2} {...props} />,
  Plus: (props: IconProps) => <Plus size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Search: (props: IconProps) => <Search size={20} color="#6B7280" strokeWidth={2} {...props} />,
  MoreHorizontal: (props: IconProps) => (
    <MoreHorizontal size={20} color="#6B7280" strokeWidth={2} {...props} />
  ),
  Target: (props: IconProps) => <Target size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Crown: (props: IconProps) => <Crown size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Folder: (props: IconProps) => <Folder size={20} color="#6B7280" strokeWidth={2} {...props} />,
  ChevronLeft: (props: IconProps) => <ChevronLeft size={20} color="#6B7280" strokeWidth={2} {...props} />,
  AlertCircle: (props: IconProps) => <AlertCircle size={20} color="#6B7280" strokeWidth={2} {...props} />,
  Star: (props: IconProps) => <Star size={20} color="#6B7280" strokeWidth={2} fill="transparent" {...props} />,
};

// Export individual icons for convenience
export {
  Home,
  User,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  CreditCard,
  LogOut,
  Edit,
  Check,
  X,
  Plus,
  Search,
  MoreHorizontal,
  Languages,
  CheckSquare,
  Menu,
  Bot,
  AppleIcon,
  GoogleIcon,
  HelpCircle,
  Phone,
  MessageCircle,
  ExternalLink,
  Star,
  Trash2,
  Edit3,
  Download,
  Share,
  Copy,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  UserCircle,
  DollarSign,
  Crown,
  ShoppingCart,
  Key,
  Send,
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Maximize,
  Minimize,
  Target,
  Award,
  Badge,
  Camera,
  Image,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Filter,
  SortAsc,
  Calendar,
  Clock,
  MapPin,
  Upload,
  Archive,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  FileText,
  Folder,
  FolderOpen,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
};
