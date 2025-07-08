const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function setupEnv() {
  console.log('🔧 Environment Variables Setup...\n');
  console.log('='.repeat(60));

  const envPath = path.join(process.cwd(), '.env.local');
  let envContent = '';
  
  // Read existing .env.local if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ Found existing .env.local file');
  } else {
    console.log('📝 Creating new .env.local file');
  }

  // Parse existing variables
  const existingVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      existingVars[match[1]] = match[2];
    }
  });

  // Define required variables with descriptions
  const requiredVars = {
    'EXPO_PUBLIC_SUPABASE_URL': {
      description: 'Your Supabase project URL (e.g., https://xxxxx.supabase.co)',
      required: true,
      extract: () => {
        const url = existingVars['EXPO_PUBLIC_SUPABASE_URL'];
        if (url) {
          const match = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
          if (match) {
            return match[1];
          }
        }
        return null;
      }
    },
    'EXPO_PUBLIC_SUPABASE_ANON_KEY': {
      description: 'Your Supabase anonymous key',
      required: true
    },
    'SUPABASE_SERVICE_ROLE_KEY': {
      description: 'Your Supabase service role key (secret)',
      required: true
    },
    'SUPABASE_PROJECT_REF': {
      description: 'Your Supabase project reference (auto-extracted from URL)',
      required: true,
      auto: true
    },
    'SUPABASE_DB_PASSWORD': {
      description: 'Your Supabase database password',
      required: true
    },
    'SUPABASE_ACCESS_TOKEN': {
      description: 'Your Supabase access token for CLI operations',
      required: true
    },
    'EXPO_PUBLIC_GOOGLE_CLIENT_ID': {
      description: 'Your Google OAuth client ID for authentication',
      required: false
    },
    'EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
      description: 'Your Stripe publishable key (pk_test_... or pk_live_...)',
      required: false
    },
    'STRIPE_SECRET_KEY': {
      description: 'Your Stripe secret key (sk_test_... or sk_live_...)',
      required: false
    },
    'STRIPE_WEBHOOKS_SECRET': {
      description: 'Your Stripe webhook secret (whsec_...)',
      required: false
    },
    'REVENUECAT_API_KEY': {
      description: 'Your RevenueCat API key',
      required: false
    },
    'EXPO_PUBLIC_REVENUECAT_IOS_KEY': {
      description: 'Your RevenueCat iOS key (appl_...)',
      required: false
    },
    'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY': {
      description: 'Your RevenueCat Android key (goog_...)',
      required: false
    },
    'EXPO_PUBLIC_PREMIUM_SUBSCRIPTION_NAME': {
      description: 'The subscription identifier that activates premium status in database (e.g., premium_monthly)',
      required: false
    },
    'EXPO_PUBLIC_SENTRY_DSN': {
      description: 'Your Sentry DSN (https://...@sentry.io/...)',
      required: false
    },
    'SENTRY_ORG': {
      description: 'Your Sentry organization slug',
      required: false
    },
    'SENTRY_PROJECT': {
      description: 'Your Sentry project slug',
      required: false
    },
    'SENTRY_AUTH_TOKEN': {
      description: 'Your Sentry auth token',
      required: false
    },
    'RESEND_API_KEY': {
      description: 'Your Resend API key (re_...)',
      required: false
    },
    'RESEND_FROM_EMAIL': {
      description: 'Your Resend from email address',
      required: false
    },
    'OPENAI_API_KEY': {
      description: 'Your OpenAI API key (sk-...)',
      required: false
    },
    'EXPO_ACCESS_TOKEN': {
      description: 'Your Expo access token (optional)',
      required: false
    }
  };

  console.log('\n🔍 Checking current environment variables...\n');

  const newVars = { ...existingVars };
  let hasChanges = false;

  for (const [varName, config] of Object.entries(requiredVars)) {
    const currentValue = existingVars[varName];
    
    if (currentValue) {
      console.log(`✅ ${varName}: Already set`);
      continue;
    }

    if (config.auto && varName === 'SUPABASE_PROJECT_REF') {
      // Auto-extract from Supabase URL
      const supabaseUrl = existingVars['EXPO_PUBLIC_SUPABASE_URL'] || newVars['EXPO_PUBLIC_SUPABASE_URL'];
      if (supabaseUrl) {
        const match = supabaseUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/);
        if (match) {
          newVars[varName] = match[1];
          console.log(`🔧 ${varName}: Auto-extracted (${match[1]})`);
          hasChanges = true;
          continue;
        }
      }
    }

    if (config.required) {
      console.log(`❌ ${varName}: Missing (REQUIRED)`);
      const value = await ask(`   Enter ${config.description}: `);
      if (value.trim()) {
        newVars[varName] = value.trim();
        hasChanges = true;
      }
    } else {
      console.log(`⚠️  ${varName}: Missing (optional)`);
      const value = await ask(`   Enter ${config.description} (press Enter to skip): `);
      if (value.trim()) {
        newVars[varName] = value.trim();
        hasChanges = true;
      }
    }
  }

  rl.close();

  if (hasChanges) {
    // Generate new .env.local content with organized sections
    const sections = [
      {
        title: 'DATABASE & BACKEND CONFIGURATION (Supabase)',
        vars: ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'SUPABASE_PROJECT_REF', 'SUPABASE_DB_PASSWORD', 'SUPABASE_ACCESS_TOKEN']
      },
      {
        title: 'AUTHENTICATION SERVICES (OAuth)',
        vars: ['EXPO_PUBLIC_GOOGLE_CLIENT_ID']
      },
      {
        title: 'PAYMENT PROCESSING (Stripe)',
        vars: ['EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOKS_SECRET']
      },
      {
        title: 'SUBSCRIPTION MANAGEMENT (RevenueCat)',
        vars: ['REVENUECAT_API_KEY', 'EXPO_PUBLIC_REVENUECAT_IOS_KEY', 'EXPO_PUBLIC_REVENUECAT_ANDROID_KEY', 'EXPO_PUBLIC_PREMIUM_SUBSCRIPTION_NAME']
      },
      {
        title: 'ERROR TRACKING & MONITORING (Sentry)',
        vars: ['EXPO_PUBLIC_SENTRY_DSN', 'SENTRY_ORG', 'SENTRY_PROJECT', 'SENTRY_AUTH_TOKEN']
      },
      {
        title: 'EMAIL SERVICES (Resend)',
        vars: ['RESEND_API_KEY', 'RESEND_FROM_EMAIL']
      },
      {
        title: 'AI SERVICES (OpenAI)',
        vars: ['OPENAI_API_KEY']
      },
      {
        title: 'EXPO PLATFORM',
        vars: ['EXPO_ACCESS_TOKEN']
      }
    ];

    let newEnvContent = '# Environment Variables Configuration\n';
    newEnvContent += '# Generated automatically - Edit carefully\n\n';

    sections.forEach(section => {
      const sectionVars = section.vars.filter(varName => newVars[varName]);
      if (sectionVars.length > 0) {
        newEnvContent += `# ${section.title}\n`;
        sectionVars.forEach(varName => {
          const description = requiredVars[varName]?.description || '';
          newEnvContent += `# ${description}\n`;
          newEnvContent += `${varName}=${newVars[varName] || ''}\n`;
        });
        newEnvContent += '\n';
      }
    });

    // Write to file
    fs.writeFileSync(envPath, newEnvContent);
    
    console.log('\n✅ .env.local file updated successfully!');
    console.log(`📄 File location: ${envPath}`);
    
    // Show summary
    console.log('\n📊 Environment Variables Summary:');
    console.log('-'.repeat(40));
    
    const setCount = Object.values(newVars).filter(v => v && v.trim()).length;
    const totalCount = Object.keys(requiredVars).length;
    
    console.log(`✅ Variables set: ${setCount}/${totalCount}`);
    console.log(`📈 Completion: ${Math.round((setCount / totalCount) * 100)}%`);
    
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npm/bun run supabase:setup');
 
  } else {
    console.log('\n✅ No changes needed - all variables are already configured!');
  }

  console.log('\n' + '='.repeat(60));
}

// Run if called directly
if (require.main === module) {
  setupEnv()
    .catch(error => {
      console.error('❌ Error during setup:', error);
      process.exit(1);
    });
}

module.exports = setupEnv; 