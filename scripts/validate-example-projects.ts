import { resolve } from 'node:path';

const REPOSITORY_ROOT = resolve(import.meta.dir, '..');

const EXAMPLE_PROJECTS = [
  'examples/basic-app',
  'examples/expo-showcase',
  'examples/food_drink/restaurant',
  'examples/shopping_commerce/marketplace',
  'examples/shopping_commerce/storefront',
  'examples/social_community/community-feed',
  'examples/social_community/photo-social',
  'examples/social_community/private-messaging',
  'examples/social_community/visual-discovery',
] as const;

function run(command: readonly string[], cwd: string): void {
  console.log(`\n> (${cwd}) ${command.join(' ')}`);

  const result = Bun.spawnSync({
    cmd: [...command],
    cwd,
    stderr: 'inherit',
    stdout: 'inherit',
  });

  if (result.exitCode !== 0) {
    throw new Error(`Command failed with exit code ${result.exitCode}: ${command.join(' ')}`);
  }
}

for (const exampleProject of EXAMPLE_PROJECTS) {
  const projectRoot = resolve(REPOSITORY_ROOT, exampleProject);
  run(['bun', 'install', '--frozen-lockfile'], projectRoot);
  run(['bun', 'run', 'typecheck'], projectRoot);
}

run(
  [
    'bunx',
    'ankhorage-eslint',
    'examples',
    '--config',
    'eslint.examples.config.mjs',
    '--max-warnings=0',
  ],
  REPOSITORY_ROOT,
);

console.log(`\nValidated ${EXAMPLE_PROJECTS.length} example dependency graphs.`);
