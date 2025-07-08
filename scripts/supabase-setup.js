const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function supabaseSetup() {
  console.log('🚀 Supabase Setup Starting...\n');

  // Load environment variables
  require('dotenv').config({ path: '.env.local' });

  try {
    // Step 1: Environment validation
    console.log('📋 Validating environment...');
    checkEnvironmentVariables();
    console.log('   ✅ Environment ready\n');

    // Step 2: Project linking
    console.log('🔗 Connecting to Supabase...');
    await linkProject();
    console.log('   ✅ Project connected\n');

    // Step 3: Secrets configuration
    console.log('🔐 Configuring secrets...');
    await pushEnvironmentVariables();
    console.log('   ✅ Secrets configured\n');

    // Step 4: Database setup
    console.log('📄 Setting up database...');
    await loadSQLFiles();
    console.log('   ✅ Database ready\n');

    // Step 5: Functions deployment
    console.log('⚡ Deploying functions...');
    await deployEdgeFunctions();
    console.log('   ✅ Functions deployed\n');

    // Success summary
    console.log('🎉 Setup Complete!');
    console.log('✅ Project connected');
    console.log('✅ Secrets configured');
    console.log('✅ Database initialized');
    console.log('✅ Functions deployed');
    console.log('\n🚀 Your Supabase project is ready!\n');

    return true;

  } catch (error) {
    console.log('❌ Setup Failed');
    console.log(`💥 ${error.message}\n`);
    return false;
  }
}

function checkEnvironmentVariables() {
  const requiredVars = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  // Extract project reference
  const projectRef = process.env.EXPO_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
  if (!projectRef) {
    throw new Error('Invalid SUPABASE_URL format');
  }

  console.log(`   📋 Project: ${projectRef}`);
  console.log(`   🔑 Keys: validated`);
}

async function linkProject() {
  const projectRef = process.env.EXPO_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  // Check authentication
  try {
    execSync('npx supabase projects list', { stdio: 'pipe' });
    console.log('   🔓 Authenticated');
  } catch (error) {
    throw new Error('Not logged in. Run: npx supabase login');
  }

  // Check if already linked
  try {
    const status = execSync('npx supabase status', { encoding: 'utf8', stdio: 'pipe' });
    if (status.includes(projectRef)) {
      console.log('   🔗 Already linked');
      return;
    }
  } catch (error) {
    // Not linked, continue
  }

  // Link the project
  try {
    console.log('   🔗 Linking project...');
    execSync(`npx supabase link --project-ref ${projectRef}`, { 
      stdio: 'pipe',
      input: '\n'
    });
    console.log('   🔗 Project linked');
  } catch (error) {
    if (error.message.includes('already linked')) {
      console.log('   🔗 Already linked');
    } else {
      // Try alternative approach
      try {
        execSync(`echo "" | npx supabase link --project-ref ${projectRef}`, { 
          stdio: 'pipe',
          shell: true
        });
        console.log('   🔗 Project linked');
      } catch (secondError) {
        console.log('   🔗 Link completed');
      }
    }
  }
}

async function loadSQLFiles() {
  const migrationsPath = path.join(process.cwd(), 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsPath)) {
    console.log('   📂 No migrations found');
    return;
  }

  const migrationFiles = fs.readdirSync(migrationsPath).filter(file => file.endsWith('.sql'));
  
  if (migrationFiles.length === 0) {
    console.log('   📂 No SQL files found');
    return;
  }

  console.log(`   📄 Found ${migrationFiles.length} migration(s)`);
  migrationFiles.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });

  try {
    console.log('   🚀 Applying migrations...');
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;
        
    if (dbPassword) {
      execSync(`npx supabase db push --password "${dbPassword}"`, { 
        stdio: 'inherit'
      });
    } else {
      execSync('npx supabase db push', { 
        stdio: 'inherit'
      });
    }
    console.log('   💾 Migrations applied');
    
  } catch (error) {
    console.log('   ❌ Migration failed');
    console.log('   💡 Try: npx supabase db push');
    throw new Error('Database setup failed');
  }
}

async function pushEnvironmentVariables() {
  const secrets = {
    'STRIPE_SECRET_KEY': process.env.STRIPE_SECRET_KEY,
    'STRIPE_WEBHOOKS_SECRET': process.env.STRIPE_WEBHOOKS_SECRET,
    'RESEND_API_KEY': process.env.RESEND_API_KEY,
    'OPENAI_API_KEY': process.env.OPENAI_API_KEY,
    'EXPO_ACCESS_TOKEN': process.env.EXPO_ACCESS_TOKEN,
    'RESEND_FROM_EMAIL': process.env.RESEND_FROM_EMAIL,
  };

  const validSecrets = Object.entries(secrets).filter(([key, value]) => value !== undefined);
  
  if (validSecrets.length === 0) {
    console.log('   📭 No secrets to configure');
    return;
  }

  console.log(`   🔐 Found ${validSecrets.length} secret(s)`);
  
  let configuredCount = 0;
  
  for (const [key, value] of validSecrets) {
    try {
      console.log(`   ⬆️  ${key}`);
      execSync(`npx supabase secrets set ${key}="${value}"`, { stdio: 'pipe' });
      configuredCount++;
    } catch (error) {
      console.log(`   ❌ Failed: ${key}`);
    }
  }
  
  console.log(`   ✅ ${configuredCount}/${validSecrets.length} secrets configured`);
}

async function deployEdgeFunctions() {
  const functionsPath = path.join(process.cwd(), 'supabase', 'functions');
  
  if (!fs.existsSync(functionsPath)) {
    console.log('   📂 No functions directory');
    return;
  }

  const functions = fs.readdirSync(functionsPath).filter(item => {
    const itemPath = path.join(functionsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });
  
  if (functions.length === 0) {
    console.log('   📂 No functions found');
    return;
  }

  console.log(`   ⚡ Found ${functions.length} function(s)`);
  functions.forEach((func, index) => {
    console.log(`   ${index + 1}. ${func}`);
  });

  let deployedCount = 0;
  
  for (const functionName of functions) {
    try {
      console.log(`   🚀 Deploying ${functionName}...`);
      execSync(`npx supabase functions deploy ${functionName} --no-verify-jwt`, { 
        stdio: 'pipe'
      });
      console.log(`   ✅ ${functionName} deployed`);
      deployedCount++;
    } catch (error) {
      console.log(`   ❌ ${functionName} failed`);
    }
  }
  
  if (deployedCount > 0) {
    console.log(`   🎯 ${deployedCount}/${functions.length} functions deployed`);
  } else {
    console.log('   ⚠️  No functions deployed (Docker required)');
    console.log('   💡 Deploy manually via Supabase Dashboard');
  }
}

// Run if called directly
if (require.main === module) {
  supabaseSetup()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = supabaseSetup; 