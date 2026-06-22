const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const baseDir = 'c:\\Users\\ASUS\\postday-web';

// Step 1: Create directories
console.log('\n=== STEP 1: Creating Directory Structure ===');
const directories = [
  'prisma',
  'src',
  'src/app',
  'src/modules',
  'src/modules/auth',
  'src/modules/dashboard',
  'src/modules/create-post',
  'src/modules/idea-generator',
  'src/modules/carousel-maker',
  'src/modules/drafts',
  'src/modules/autopilot',
  'src/modules/calendar',
  'src/modules/media-library',
  'src/modules/analytics',
  'src/modules/settings',
  'src/modules/notifications',
  'src/modules/billing',
  'src/modules/profile',
  'src/modules/error-pages',
  'src/shared',
  'src/shared/components',
  'src/shared/hooks',
  'src/shared/types',
  'src/shared/utils',
  'src/shared/services',
  'src/shared/layouts',
  'src/api',
  'src/lib',
  'src/styles',
  'src/constants',
];

try {
  directories.forEach((dir) => {
    const fullPath = path.join(baseDir, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
  console.log('✓ Directory structure created successfully');
} catch (err) {
  console.error('✗ Error creating directories:', err.message);
  process.exit(1);
}

// Step 2: Install npm dependencies
console.log('\n=== STEP 2: Installing npm Dependencies ===');
try {
  process.chdir(baseDir);
  execSync('npm install', { stdio: 'inherit', shell: true });
  console.log('✓ npm install completed successfully');
} catch (err) {
  console.error('✗ npm install failed');
  process.exit(1);
}

// Step 3: Generate Prisma client
console.log('\n=== STEP 3: Generating Prisma Client ===');
try {
  execSync('npm run prisma:generate', { stdio: 'inherit', shell: true });
  console.log('✓ Prisma client generated successfully');
} catch (err) {
  console.error('✗ Prisma generation failed');
  process.exit(1);
}

// Step 4: Type-check TypeScript
console.log('\n=== STEP 4: Type-Checking TypeScript ===');
try {
  execSync('npm run type-check', { stdio: 'inherit', shell: true });
  console.log('✓ TypeScript type-check passed');
} catch (err) {
  console.error('✗ TypeScript type-check failed');
  process.exit(1);
}

console.log('\n=== ALL TASKS COMPLETED SUCCESSFULLY ===');
