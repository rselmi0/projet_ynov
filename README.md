# My Expo App 📱

Une application mobile moderne construite avec Expo et React Native, intégrant MMKV pour le stockage.

## 🚀 Fonctionnalités

- 🔐 **Authentification** : Système complet avec Supabase
- 📝 **Gestion des tâches** : CRUD avec synchronisation offline
- 💾 **Stockage MMKV** : Stockage haute performance
- 🎨 **UI moderne** : Interface utilisateur avec NativeWind
- 🌙 **Mode sombre** : Support du thème sombre
- 📱 **Notifications** : Push notifications avec Expo
- 💳 **Paiements** : Intégration Stripe
- 🔄 **Synchronisation** : Gestion offline/online

## 📦 Stockage MMKV Simplifié

Le projet utilise MMKV avec une architecture simple :

```
lib/storage/
├── index.ts       # APIs simples (cache, prefs, debug)
├── zustand.ts     # Adaptateur pour Zustand
└── supabase.ts    # Adaptateur pour Supabase
```

### Instances de stockage :
- `app` : Stockage principal
- `cache` : Cache simple
- `auth` : Authentification
- `state` : Stores Zustand
- `prefs` : Préférences

### API simple

```typescript
// Cache basique
cache.set('key', data);
const data = cache.get('key');
cache.remove('key');

// Préférences
prefs.set('theme', 'dark');
const theme = prefs.getString('theme', 'light');
const enabled = prefs.getBoolean('notifications', true);

// Debug
debug.getSize(); // Tailles des stockages
debug.clearAll(); // Vider tout
```

### Hook simple

```typescript
const { data, setData, clearData } = useSimpleCache('user-prefs');
```

## 🛠 Installation

```bash
# Cloner et installer
git clone <repository-url>
cd my-expo-app
npm install

# Configuration
cp .env.example .env

# Lancer
npx expo start
```

## 📱 Scripts

```bash
npm run start          # Démarrer Expo
npm run android        # Build Android
npm run ios           # Build iOS
npm run web           # Lancer sur le web
```

## 🔧 Configuration

### Variables d'environnement

Le fichier `.env.local` est automatiquement organisé par sections logiques :

#### Base de données (Supabase)
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### Paiements (Stripe)
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOKS_SECRET=your_webhook_secret
```

#### Subscriptions (RevenueCat)
```env
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your_android_key
EXPO_PUBLIC_PREMIUM_SUBSCRIPTION_NAME=premium_monthly
```

#### Monitoring (Sentry)
```env
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project
```

Pour configurer facilement toutes les variables :
```bash
npm run setup:env
```

## 🏗 Architecture

```
app/                 # Écrans
components/          # Composants UI
hooks/               # Hooks personnalisés
lib/storage/         # Stockage MMKV
stores/              # Stores Zustand
types/               # Types TypeScript
```

## 🔄 Système Offline

- **Détection réseau** : Statut en temps réel
- **Queue offline** : Operations en attente
- **Synchronisation** : Auto-sync au retour en ligne
- **Stockage persistant** : MMKV natif

## 🎨 Thèmes

- Mode sombre/clair
- Détection système automatique
- Persistance des préférences

## 📄 License

MIT License # standard
