import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

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

const ROUTER_EXAMPLE_PROJECTS = EXAMPLE_PROJECTS.slice(2);

function collectRouteModules(root: string): readonly string[] {
  const routeModules: string[] = [];

  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);

    if (entry.isDirectory()) {
      routeModules.push(...collectRouteModules(path));
    } else if (entry.isFile() && /\.(?:ts|tsx)$/.test(entry.name)) {
      routeModules.push(path);
    }
  }

  return routeModules;
}

function verifyRouterTree(projectRoot: string): void {
  for (const routeModule of collectRouteModules(join(projectRoot, 'app'))) {
    const source = readFileSync(routeModule, 'utf8');

    if (!/\bexport\s+default\b/.test(source)) {
      throw new Error(`Expo Router app tree contains a non-route module: ${routeModule}`);
    }
  }
}

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

run(['bun', 'run', 'build'], REPOSITORY_ROOT);

for (const routerProject of ROUTER_EXAMPLE_PROJECTS) {
  verifyRouterTree(resolve(REPOSITORY_ROOT, routerProject));
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
