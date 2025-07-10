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

function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    log(`🗑️ Removing ${dirPath}...`, 'yellow');
    fs.rmSync(dirPath, { recursive: true, force: true });
    log(`✅ Removed ${dirPath}`, 'green');
  } else {
    log(`ℹ️ ${dirPath} doesn't exist, skipping...`, 'blue');
  }
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
    
    log('\n📋 Configuration Summary:', 'bright');
    log(`App Name: ${appName}`, 'yellow');
    log(`App Slug: ${appSlug}`, 'yellow');
    log(`Bundle ID: ${bundleId}`, 'yellow');
    
    const confirm = await promptUser('\nProceed with this configuration? (y/N): ');
    
    if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
      log('❌ Initialization cancelled', 'red');
      process.exit(0);
    }
    
    log('\n🔧 Starting initialization...', 'bright');
    
    // Step 1: Remove .expo directory
    removeDirectory('.expo');
    
    // Step 2: Update app.json
    updateAppConfig(bundleId, appName, appSlug);
    
    // Step 3: Update package.json
    updatePackageJson(appName, appSlug);
    
    // Step 4: Update identifiers throughout project
    updateIdentifiersInProject(bundleId);

    // Step 5: Update supabase config
    updateSupabaseConfig(bundleId, appSlug);
    
    // Success message
    log('\n🎉 Initialization completed successfully!', 'green');
    log('\n📋 Next Steps:', 'bright');
    log('1. Run: npm install (to clean up dependencies)', 'yellow');
    log('2. Run: npx expo prebuild (to generate native code)', 'yellow');
    log('3. Run: eas init (to initialize EAS project)', 'yellow');
    log('4. Configure your environment variables', 'yellow');
    log('5. Set up your authentication providers', 'yellow');
    
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