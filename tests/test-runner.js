process.env.NODE_ENV = 'test';
const { execSync } = require('child_process');

try {
  execSync('jest --coverage', { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
