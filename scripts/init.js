#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function validateBundleId(bundleId) {
  const bundleIdRegex = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)+$/;
  
  if (!bundleIdRegex.test(bundleId)) {
    return false;
  }
  
  // Check that it has at least 2 parts (com.company)
  const parts = bundleId.split('.');
  if (parts.length < 2) {
    return false;
  }
  
  // Check that no part is empty
  return parts.every(part => part.length > 0);
}

function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function getBundleIdentifier() {
  let bundleId = '';
  
  while (!bundleId || !validateBundleId(bundleId)) {
    log('\n📱 Bundle Identifier Setup', 'cyan');
    log('Format: com.yourcompany.yourapp', 'yellow');
    log('Example: com.foodieapp.mobile', 'yellow');
    
    bundleId = await promptUser('\nEnter your new bundle identifier: ');
    
    if (!validateBundleId(bundleId)) {
      log('❌ Invalid bundle identifier format!', 'red');
      log('Please use format: com.yourcompany.yourapp', 'yellow');
    }
  }
  
  return bundleId;
}

async function getAppName() {
  let appName = '';
  
  while (!appName) {
    appName = await promptUser('Enter your app name (e.g., "My Awesome App"): ');
    
    if (!appName.trim()) {
      log('❌ App name cannot be empty!', 'red');
      appName = '';
    }
  }
  
  return appName.trim();
}

async function getAppSlug() {
  let appSlug = '';
  
  while (!appSlug) {
    appSlug = await promptUser('Enter your app slug (e.g., "my-awesome-app"): ');
    
    if (!appSlug.trim()) {
      log('❌ App slug cannot be empty!', 'red');
      appSlug = '';
    }
  }
  
  return appSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

async function getStripePreference() {
  log('\n💳 Stripe Payment Integration', 'cyan');
  log('Stripe allows you to process payments in your app', 'yellow');
  log('If you don\'t need payments, you can remove it to reduce bundle size', 'yellow');
  
  const useStripe = await promptUser('\nDo you want to use Stripe for payments? (y/N): ');
  
  return useStripe.toLowerCase() === 'y' || useStripe.toLowerCase() === 'yes';
}

async function getRevenueCatPreference() {
  log('\n🛒 RevenueCat Subscription Management', 'cyan');
  log('RevenueCat manages in-app purchases and subscriptions', 'yellow');
  log('If you don\'t need subscriptions, you can remove it', 'yellow');
  
  const useRevenueCat = await promptUser('\nDo you want to use RevenueCat for subscriptions? (y/N): ');
  
  return useRevenueCat.toLowerCase() === 'y' || useRevenueCat.toLowerCase() === 'yes';
}

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    // Get relative path from current working directory
    const relativePath = path.relative(process.cwd(), dirPath);
    log(`🗑️ Removing ${relativePath}...`, 'yellow');
    fs.rmSync(dirPath, { recursive: true, force: true });
    log(`✅ Removed ${relativePath}`, 'green');
  } else {
    const relativePath = path.relative(process.cwd(), dirPath);
    log(`ℹ️ ${relativePath} doesn't exist, skipping...`, 'blue');
  }
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    // Get relative path from current working directory
    const relativePath = path.relative(process.cwd(), filePath);
    log(`🗑️ Removing ${relativePath}...`, 'yellow');
    fs.unlinkSync(filePath);
    log(`✅ Removed ${relativePath}`, 'green');
  } else {
    const relativePath = path.relative(process.cwd(), filePath);
    log(`ℹ️ ${relativePath} doesn't exist, skipping...`, 'blue');
  }
}

function removeStripeFromAppConfig() {
  const appConfigPath = path.join(process.cwd(), 'app.json');
  
  log('📝 Removing Stripe from app.json...', 'cyan');
  
  if (!fs.existsSync(appConfigPath)) {
    log('❌ app.json not found!', 'red');
    return;
  }
  
  const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
  
  // Remove Stripe plugin
  if (appConfig.expo && appConfig.expo.plugins) {
    appConfig.expo.plugins = appConfig.expo.plugins.filter(plugin => {
      const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
      return pluginName !== '@stripe/stripe-react-native';
    });
  }
  
  fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2));
  log('✅ Removed Stripe from app.json', 'green');
}

function removeStripeFromPackageJson() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  log('📝 Removing Stripe from package.json...', 'cyan');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json not found!', 'red');
    return;
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Remove Stripe dependency
  if (packageJson.dependencies && packageJson.dependencies['@stripe/stripe-react-native']) {
    delete packageJson.dependencies['@stripe/stripe-react-native'];
  }
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  log('✅ Removed Stripe from package.json', 'green');
}

function removeStripeFromLayout() {
  const layoutPath = path.join(process.cwd(), 'app/_layout.tsx');
  
  log('📝 Removing Stripe from _layout.tsx...', 'cyan');
  
  if (!fs.existsSync(layoutPath)) {
    log('❌ app/_layout.tsx not found!', 'red');
    return;
  }
  
  let content = fs.readFileSync(layoutPath, 'utf8');
  
  // Remove import
  content = content.replace(/import ExpoStripeProvider from '@\/context\/StripeContext';\n/g, '');
  
  // Remove wrapper - find the ExpoStripeProvider wrapper and remove it
  content = content.replace(/<ExpoStripeProvider>\s*\n/g, '');
  content = content.replace(/\s*<\/ExpoStripeProvider>\n/g, '');
  
  fs.writeFileSync(layoutPath, content, 'utf8');
  log('✅ Removed Stripe from _layout.tsx', 'green');
}

function removeStripeFromPaymentIndex() {
  const indexPath = path.join(process.cwd(), 'components/payment/index.ts');
  
  log('📝 Removing Stripe from payment/index.ts...', 'cyan');
  
  if (!fs.existsSync(indexPath)) {
    log('⚠️ components/payment/index.ts not found, skipping...', 'yellow');
    return;
  }
  
  let content = fs.readFileSync(indexPath, 'utf8');
  
  // Use simple string replacement to be absolutely sure
  content = content.replace("export { PaymentSheet } from './PaymentSheet';\n", '');
  content = content.replace("export { PaymentSheet } from './PaymentSheet';", '');
  content = content.replace("export { PayNowButton } from './stripeButtonPay';\n", '');
  content = content.replace("export { PayNowButton } from './stripeButtonPay';", '');
  
  // Clean up any empty lines
  content = content.replace(/\n\n+/g, '\n');
  
  fs.writeFileSync(indexPath, content, 'utf8');
  log('✅ Removed Stripe exports from payment/index.ts', 'green');
}

function cleanPaymentPage() {
  const paymentPath = path.join(process.cwd(), 'app/(protected)/(tabs)/payment.tsx');
  
  log('📝 Cleaning payment.tsx from Stripe code...', 'cyan');
  
  if (!fs.existsSync(paymentPath)) {
    log('⚠️ payment.tsx not found, skipping...', 'yellow');
    return;
  }
  
  // Create a new payment.tsx with only RevenueCat
  const newContent = `import React, { useState } from 'react';
import { View, ScrollView, Alert, Image } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { PaymentButton } from '@/components/payment/PaymentButton';
import Paywall from 'react-native-purchases-ui';
import { Text } from '@/components/ui/text';
import * as Haptics from 'expo-haptics';

export default function PaymentScreen() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handlePaywall = async () => {
    try {
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Paywall.presentPaywall();
    } catch (_error) {
      Alert.alert(t('common.error'), t('payment.alerts.generalError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-4 py-2">
        {/* Section d'introduction */}
        <View className="rounded-2xl bg-card p-6">
          <Text className="text-foreground" style={{ fontSize: 20, fontWeight: 'bold' }}>
            {t('payment.title')}
          </Text>
          <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
            {t('payment.subtitle')}
          </Text>
        </View>

        {/* Bouton de paiement RevenueCat */}
        <View className="mb-8 gap-4">
          <PaymentButton
            title={t('payment.buttons.revenueCat.title')}
            subtitle={t('payment.buttons.revenueCat.subtitle')}
            imageSource={require('../../../assets/logo/revenuecat.png')}
            onPress={handlePaywall}
            loading={loading}
            imageBackgroundColor="bg-purple-50 dark:bg-purple-900/20"
          />
        </View>

        {/* Section d'information RevenueCat */}
        <View className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <Text
            className="mb-6 text-center text-foreground"
            style={{ fontSize: 18, fontWeight: 'bold' }}>
            {t('payment.revenueCat.title')}
          </Text>

          <View className="mb-6 flex-row justify-center">
            <View className="items-center">
              <View className="mb-3 rounded-2xl bg-purple-50 p-4 dark:bg-purple-900/20">
                <Image
                  source={require('../../../assets/logo/revenuecat.png')}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-foreground" style={{ fontSize: 16, fontWeight: '600' }}>
                {t('payment.comparison.revenueCat')}
              </Text>
            </View>
          </View>

          <View style={{ gap: 12 }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
                {t('payment.comparison.easeOfUse')}
              </Text>
              <Text className="text-green-600" style={{ fontSize: 14, fontWeight: '500' }}>
                {t('payment.comparison.values.easy')}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-muted-foreground" style={{ fontSize: 14 }}>
                {t('payment.comparison.transactionFees')}
              </Text>
              <Text className="text-yellow-600" style={{ fontSize: 14, fontWeight: '500' }}>
                1%
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
`;
  
  fs.writeFileSync(paymentPath, newContent, 'utf8');
  log('✅ Cleaned payment.tsx - kept only RevenueCat', 'green');
}

function removeStripeFiles() {
  log('🗑️ Removing Stripe-related files...', 'cyan');
  
  // Remove Stripe context
  removeFile(path.join(process.cwd(), 'context/StripeContext.tsx'));
  
  // Remove Stripe payment components
  removeFile(path.join(process.cwd(), 'components/payment/PaymentSheet.tsx'));
  removeFile(path.join(process.cwd(), 'components/payment/stripeButtonPay.tsx'));
  
  // Clean payment index and page instead of removing them
  removeStripeFromPaymentIndex();
  cleanPaymentPage();
  
  // Remove Stripe Supabase functions
  removeDirectory(path.join(process.cwd(), 'supabase/functions/create-payment-intent'));
  removeDirectory(path.join(process.cwd(), 'supabase/functions/create-stripe-checkout'));
  removeDirectory(path.join(process.cwd(), 'supabase/functions/stripe-webhooks'));
  
  // Remove Stripe logo
  removeFile(path.join(process.cwd(), 'assets/logo/stripe.jpeg'));
  
  log('✅ Removed all Stripe-related files', 'green');
}

function removeRevenueCatFromLayout() {
  const layoutPath = path.join(process.cwd(), 'app/_layout.tsx');
  
  log('📝 Removing RevenueCat from _layout.tsx...', 'cyan');
  
  if (!fs.existsSync(layoutPath)) {
    log('❌ app/_layout.tsx not found!', 'red');
    return;
  }
  
  let content = fs.readFileSync(layoutPath, 'utf8');
  
  // Remove import using simple string replacement
  content = content.replace("import { RevenueCatProvider } from '@/context/RevenuCatContext';\n", '');
  content = content.replace("import { RevenueCatProvider } from '@/context/RevenuCatContext';", '');
  
  // Remove wrapper - find the RevenueCatProvider wrapper and remove it
  content = content.replace('<RevenueCatProvider>\n', '');
  content = content.replace('<RevenueCatProvider>', '');
  content = content.replace('</RevenueCatProvider>\n', '');
  content = content.replace('</RevenueCatProvider>', '');
  
  // Also handle with spaces/indentation
  content = content.replace('      <RevenueCatProvider>\n', '');
  content = content.replace('      <RevenueCatProvider>', '');
  content = content.replace('      </RevenueCatProvider>\n', '');
  content = content.replace('      </RevenueCatProvider>', '');
  
  // Clean up any empty lines
  content = content.replace(/\n\n+/g, '\n');
  
  fs.writeFileSync(layoutPath, content, 'utf8');
  log('✅ Removed RevenueCat from _layout.tsx', 'green');
}

function removeRevenueCatIntegration() {
  log('\n🚫 Removing RevenueCat integration...', 'bright');
  
  // Only remove from _layout.tsx as requested
  removeRevenueCatFromLayout();
  
  log('✅ RevenueCat integration removed from _layout.tsx!', 'green');
}

function uninstallStripePackage() {
  log('📦 Uninstalling Stripe package...', 'cyan');
  
  try {
    execSync('npm uninstall @stripe/stripe-react-native', { stdio: 'inherit' });
    log('✅ Uninstalled Stripe package', 'green');
  } catch (error) {
    log('⚠️ Failed to uninstall Stripe package automatically', 'yellow');
    log('You may need to run: npm uninstall @stripe/stripe-react-native', 'yellow');
  }
}

function removeStripeIntegration() {
  log('\n🚫 Removing Stripe integration...', 'bright');
  
  // Remove from app.json
  removeStripeFromAppConfig();
  
  // Remove from package.json
  removeStripeFromPackageJson();
  
  // Remove from _layout.tsx
  removeStripeFromLayout();
  
  // Remove all Stripe files
  removeStripeFiles();
  
  // Uninstall package
  uninstallStripePackage();
  
  log('✅ Stripe integration removed successfully!', 'green');
}

function updateAppConfig(bundleId, appName, appSlug) {
  const appConfigPath = path.join(process.cwd(), 'app.json');
  
  log('📝 Updating app.json...', 'cyan');
  
  if (!fs.existsSync(appConfigPath)) {
    log('❌ app.json not found!', 'red');
    process.exit(1);
  }
  
  const appConfig = JSON.parse(fs.readFileSync(appConfigPath, 'utf8'));
  
  // Update basic info
  appConfig.expo.name = appName;
  appConfig.expo.slug = appSlug;
  appConfig.expo.scheme = bundleId;
  
  // Update bundle identifiers
  appConfig.expo.ios.bundleIdentifier = bundleId;
  appConfig.expo.android.package = bundleId;
  

  
  // Remove owner field
  delete appConfig.expo.owner;
  
  // Remove EAS projectId
  if (appConfig.expo.extra && appConfig.expo.extra.eas) {
    delete appConfig.expo.extra.eas.projectId;
    if (Object.keys(appConfig.expo.extra.eas).length === 0) {
      delete appConfig.expo.extra.eas;
    }
  }
  
  // Remove updates URL
  delete appConfig.expo.updates;
  

  

  
  fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2));
  log('✅ Updated app.json', 'green');
}

function updatePackageJson(appName, appSlug) {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  log('📝 Updating package.json...', 'cyan');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json not found!', 'red');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Update name with slug format
  packageJson.name = appSlug;
  
  // Reset version
  packageJson.version = '1.0.0';
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  log('✅ Updated package.json', 'green');
}

function searchAndReplace(filePath, searchValue, replaceValue) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchValue)) {
      content = content.replace(new RegExp(searchValue, 'g'), replaceValue);
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
  }
  return false;
}

function updateIdentifiersInProject(bundleId) {
  log('🔍 Updating identifiers throughout the project...', 'cyan');
  
  const oldBundleId = 'com.expoplate.expoplate';
  const oldTemplateId = 'com.expobase.template';
  
  // Files to update
  const filesToCheck = [
    'README.md',
    'eas.json'
  ];
  
  let updatedFiles = 0;
  
  filesToCheck.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    let updated = false;
    
    updated = searchAndReplace(filePath, oldBundleId, bundleId) || updated;
    updated = searchAndReplace(filePath, oldTemplateId, bundleId) || updated;
    updated = searchAndReplace(filePath, 'expoplate', bundleId.split('.')[1] || 'myapp') || updated;
    updated = searchAndReplace(filePath, 'Expobase', bundleId.split('.')[1] || 'MyApp') || updated;
    
    if (updated) {
      updatedFiles++;
      log(`  ✅ Updated ${file}`, 'green');
    }
  });
  
  log(`✅ Updated ${updatedFiles} files with new identifiers`, 'green');
}

function updateSupabaseConfig(bundleId, appSlug) {
  const configPath = path.join(process.cwd(), 'supabase', 'config.toml');
  
  log('📝 Updating supabase/config.toml...', 'cyan');
  
  if (!fs.existsSync(configPath)) {
    log('⚠️ supabase/config.toml not found, skipping...', 'yellow');
    return;
  }
  
  let content = fs.readFileSync(configPath, 'utf8');
  
  // Update project_id with app slug
  content = content.replace(/project_id = ".*"/, `project_id = "${appSlug}"`);
  
  // Update Apple client_id
  content = content.replace(/client_id = "com\.expobase\.expobase"/, `client_id = "${bundleId}"`);
  
  // Also update any remaining references to the old bundle ID
  content = content.replace(/com\.expoplate\.expoplate/g, bundleId);
  
  fs.writeFileSync(configPath, content, 'utf8');
  log('✅ Updated supabase/config.toml', 'green');
}


async function runInitialization() {
  console.clear();
  log('🚀 App Initialization Script', 'bright');
  log('================================', 'cyan');
  
  try {
    // Get user input
    const bundleId = await getBundleIdentifier();
    const appName = await getAppName();
    const appSlug = await getAppSlug();
    const useStripe = await getStripePreference();
    const useRevenueCat = await getRevenueCatPreference();
    
    log('\n📋 Configuration Summary:', 'bright');
    log(`App Name: ${appName}`, 'yellow');
    log(`App Slug: ${appSlug}`, 'yellow');
    log(`Bundle ID: ${bundleId}`, 'yellow');
    log(`Use Stripe: ${useStripe ? 'Yes' : 'No'}`, 'yellow');
    log(`Use RevenueCat: ${useRevenueCat ? 'Yes' : 'No'}`, 'yellow');
    
    const confirm = await promptUser('\nProceed with this configuration? (y/N): ');
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      log('❌ Initialization cancelled', 'red');
      process.exit(0);
    }
    
    log('\n🔧 Starting initialization...', 'bright');
    
    // Step 1: Remove .expo directory
    removeDirectory('.expo');
    
    // Step 2: Handle Stripe integration
    if (!useStripe) {
      removeStripeIntegration();
    }

    // Step 3: Handle RevenueCat integration
    if (!useRevenueCat) {
      removeRevenueCatIntegration();
    }
    
    // Step 4: Update app.json
    updateAppConfig(bundleId, appName, appSlug);
    
    // Step 5: Update package.json
    updatePackageJson(appName, appSlug);
    
    // Step 6: Update identifiers throughout project
    updateIdentifiersInProject(bundleId);

    // Step 7: Update supabase config
    updateSupabaseConfig(bundleId, appSlug);
    
    // Success message
    log('\n🎉 Initialization completed successfully!', 'green');
    log('\n📋 Next Steps:', 'bright');
    log('1. Run: npm install (to clean up dependencies)', 'yellow');
    log('2. Run: npx expo prebuild (to generate native code)', 'yellow');
    log('3. Run: eas init (to initialize EAS project)', 'yellow');
    log('4. Configure your environment variables', 'yellow');
    log('5. Set up your authentication providers', 'yellow');
    
    if (!useStripe) {
      log('\n💳 Stripe Integration Removed:', 'magenta');
      log('• All Stripe-related files and configurations have been removed', 'yellow');
      log('• You can always add Stripe back later if needed', 'yellow');
    }

    if (!useRevenueCat) {
      log('\n🛒 RevenueCat Integration Removed:', 'magenta');
      log('• RevenueCat context and wrapper have been removed from _layout.tsx', 'yellow');
      log('• You can always add RevenueCat back later if needed', 'yellow');
    }
    
    log('\n⚠️ Important Notes:', 'magenta');
    log('• EAS project ID and owner have been cleared', 'yellow');
    log('• Update your environment variables accordingly', 'yellow');
    
  } catch (error) {
    log(`\n❌ Error during initialization: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
runInitialization(); 