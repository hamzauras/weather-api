import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';

function runPrismaDeploy(envPath: string, schemaPath: string = './prisma/schema.prisma') {
  console.log(`Applying migrations for env: ${envPath}`);
  execSync(
    `npx dotenv -e ${envPath} -- prisma migrate deploy --schema=${schemaPath}`,
    { stdio: 'inherit' }
  );
}

function main() {
  const schema = path.resolve('./prisma/schema.prisma');

  // Apply for development DB
  runPrismaDeploy('.env', schema);

  // Apply for test DB
  runPrismaDeploy('.env.test', schema);

  console.log('Both databases have been initialized.');
}

main();
