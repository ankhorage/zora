#!/usr/bin/env bun

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const APP_CATEGORIES = [
  'books_reading',
  'business_productivity',
  'developer_tools',
  'education_learning',
  'entertainment_media',
  'finance_money',
  'food_drink',
  'games',
  'graphics_design',
  'health_fitness',
  'kids_family',
  'lifestyle',
  'medical',
  'music_audio',
  'navigation_travel',
  'news_magazines',
  'photo_video',
  'reference',
  'shopping_commerce',
  'social_community',
  'sports',
  'utilities_tools',
  'weather',
] as const;

type AppCategory = (typeof APP_CATEGORIES)[number];

interface RouteSpec {
  readonly name: string;
  readonly label: string;
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCardTitle: string;
  readonly primaryCardDescription: string;
}

interface ScaffoldOptions {
  readonly category: AppCategory;
  readonly exampleId: string;
  readonly title: string;
}

const communityFeedRoutes = [
  {
    name: 'index',
    label: 'Feed',
    icon: 'newspaper-outline',
    title: 'Community feed',
    description: 'A real Expo Router tab backed by ZORA surfaces and realistic static content.',
    primaryCardTitle: 'Morning design critique',
    primaryCardDescription: 'Three new posts are ready for review across your community groups.',
  },
  {
    name: 'groups',
    label: 'Groups',
    icon: 'people-outline',
    title: 'Groups',
    description: 'Follow active spaces, upcoming events, and moderation needs.',
    primaryCardTitle: 'Design systems circle',
    primaryCardDescription: '128 members · 14 new posts · weekly critique on Friday.',
  },
  {
    name: 'messages',
    label: 'Messages',
    icon: 'chatbubble-outline',
    title: 'Messages',
    description: 'A lightweight social inbox screen for the starter app.',
    primaryCardTitle: 'Mia Chen',
    primaryCardDescription: 'Sent feedback on the onboarding flow two minutes ago.',
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: 'person-outline',
    title: 'Profile',
    description: 'Profile summary, audience health, and personal activity.',
    primaryCardTitle: 'Creator profile',
    primaryCardDescription: '1.8k followers · 243 saved posts · 32 active conversations.',
  },
  {
    name: 'settings',
    label: 'Settings',
    icon: 'settings-outline',
    title: 'Settings',
    description: 'Account, privacy, notifications, and moderation preferences.',
    primaryCardTitle: 'Notification digest',
    primaryCardDescription: 'Daily highlights are enabled for followed groups and direct messages.',
  },
] as const satisfies readonly RouteSpec[];

const defaultRoutes = [
  {
    name: 'index',
    label: 'Home',
    icon: 'home-outline',
    title: 'Home',
    description: 'A real Expo Router tab backed by ZORA components.',
    primaryCardTitle: 'Welcome',
    primaryCardDescription:
      'This starter proves the app shell, routing, and ZORA provider are connected.',
  },
  {
    name: 'explore',
    label: 'Explore',
    icon: 'compass-outline',
    title: 'Explore',
    description: 'A second route for validating navigation and screen composition.',
    primaryCardTitle: 'Explore content',
    primaryCardDescription:
      'Replace this card with realistic content for the selected app archetype.',
  },
  {
    name: 'profile',
    label: 'Profile',
    icon: 'person-outline',
    title: 'Profile',
    description: 'A simple profile route for the scaffolded app.',
    primaryCardTitle: 'Profile summary',
    primaryCardDescription: 'Use this route to model account and user-specific content.',
  },
] as const satisfies readonly RouteSpec[];

const routePresets: Readonly<Record<string, readonly RouteSpec[]>> = {
  'community-feed': communityFeedRoutes,
};

function printUsage(): never {
  console.error(
    [
      'Usage:',
      '  bun run scripts/scaffold-zora-example-app.ts <app-category>/<example-id> "Example Title"',
      '',
      'Examples:',
      '  bun run scripts/scaffold-zora-example-app.ts social_community/community-feed "Community Feed"',
      '  bun run scripts/scaffold-zora-example-app.ts shopping_commerce/marketplace "Marketplace"',
      '',
      'The generated app installs @ankhorage/zora from npm so it behaves like a real consumer app.',
      'Do not point the example dependency at the repository root; Metro will recursively crawl the repo.',
    ].join('\n'),
  );
  process.exit(1);
}

function isAppCategory(value: string): value is AppCategory {
  return APP_CATEGORIES.some((category) => category === value);
}

function isExampleId(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

function parseArgs(argv: readonly string[]): ScaffoldOptions {
  const target = argv[0];
  const title = argv[1];

  if (!target || !title) {
    printUsage();
  }

  const [category, exampleId, unexpected] = target.split('/');

  if (!category || !exampleId || unexpected) {
    throw new Error('Target must use the form <app-category>/<example-id>.');
  }

  if (!isAppCategory(category)) {
    throw new Error(`Unknown app category "${category}".`);
  }

  if (!isExampleId(exampleId)) {
    throw new Error('Example id must be lowercase kebab-case.');
  }

  return {
    category,
    exampleId,
    title,
  };
}

function run(command: string, args: readonly string[], cwd: string): void {
  const result = spawnSync(command, [...args], {
    cwd,
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed with status ${result.status ?? 'unknown'}.`,
    );
  }
}

function writeTextFile(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${content.trim()}\n`);
}

function getRoutes(exampleId: string): readonly RouteSpec[] {
  return routePresets[exampleId] ?? defaultRoutes;
}

function createRouteMapSource(routes: readonly RouteSpec[]): string {
  return routes
    .map(
      (route) =>
        `  ${JSON.stringify(route.name)}: { label: ${JSON.stringify(route.label)}, icon: { name: ${JSON.stringify(
          route.icon,
        )} } },`,
    )
    .join('\n');
}

function createScreenSource(route: RouteSpec): string {
  return `import { AppBar, Badge, Button, Card, Screen, ScreenSection, Text } from '@ankhorage/zora';

export default function ${route.name === 'index' ? 'Index' : toPascalCase(route.name)}Screen() {
  return (
    <>
      <AppBar title=${JSON.stringify(route.title)} subtitle=${JSON.stringify(route.description)} />
      <Screen>
        <ScreenSection
          title="Highlights"
          description="This screen uses real Expo Router navigation and ZORA-only UI."
        >
          <Card
            title=${JSON.stringify(route.primaryCardTitle)}
            description=${JSON.stringify(route.primaryCardDescription)}
            actions={<Badge tone="success">Live route</Badge>}
          >
            <Text tone="muted">
              Replace this starter content with realistic static data for the selected app archetype.
            </Text>
          </Card>
          <Card
            title="Next useful action"
            description="The scaffold keeps layout decisions inside ZORA components instead of local styles."
            actions={<Button>Continue</Button>}
            tone="subtle"
          />
        </ScreenSection>
      </Screen>
    </>
  );
}
`;
}

function toPascalCase(value: string): string {
  return value
    .split('-')
    .map((segment) => `${segment.charAt(0).toUpperCase()}${segment.slice(1)}`)
    .join('');
}

function createPackageName(options: ScaffoldOptions): string {
  return `zora-example-${options.category.replaceAll('_', '-')}-${options.exampleId}`;
}

function createAppFiles(options: ScaffoldOptions, targetDir: string): void {
  const routes = getRoutes(options.exampleId);
  const appDir = join(targetDir, 'app');

  rmSync(appDir, { recursive: true, force: true });

  writeTextFile(
    join(targetDir, 'app.json'),
    `{
  "expo": {
    "name": ${JSON.stringify(options.title)},
    "slug": ${JSON.stringify(options.exampleId)},
    "scheme": ${JSON.stringify(options.exampleId)},
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "web": {
      "bundler": "metro",
      "output": "single"
    },
    "plugins": ["expo-router"]
  }
}`,
  );

  writeTextFile(
    join(targetDir, 'package.json'),
    `{
  "name": ${JSON.stringify(createPackageName(options))},
  "version": "1.0.0",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@ankhorage/zora": "latest",
    "@expo/vector-icons": "^15.1.1",
    "@react-native-picker/picker": "2.11.1",
    "expo": "~54.0.34",
    "expo-font": "~14.0.11",
    "expo-router": "~6.0.20",
    "expo-status-bar": "~3.0.9",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "^0.21.0"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "typescript": "~5.9.2"
  }
}`,
  );

  writeTextFile(
    join(targetDir, 'tsconfig.json'),
    `{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}`,
  );

  writeTextFile(join(targetDir, 'expo-env.d.ts'), `/// <reference types="expo/types" />`);

  writeTextFile(
    join(appDir, '_layout.tsx'),
    `import { Stack } from 'expo-router';
import { ZoraProvider } from '@ankhorage/zora';

export default function RootLayout() {
  return (
    <ZoraProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ZoraProvider>
  );
}`,
  );

  writeTextFile(
    join(appDir, '(tabs)', '_layout.tsx'),
    `import { Tabs } from 'expo-router';
import { ZoraTabBar, type ZoraNavigationRouteMap } from '@ankhorage/zora';

const routeMap: ZoraNavigationRouteMap = {
${createRouteMapSource(routes)}
};

export default function TabLayout() {
  return <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <ZoraTabBar {...props} routeMap={routeMap} />} />;
}`,
  );

  for (const route of routes) {
    writeTextFile(join(appDir, '(tabs)', `${route.name}.tsx`), createScreenSource(route));
  }

  writeTextFile(
    join(targetDir, 'README.md'),
    `# ${options.title}

Real Expo Router + React Native Web example app for ZORA.

## Run

\`\`\`bash
bun install
bunx expo start
\`\`\`

## Notes

- Uses real Expo Router route files.
- Uses ZORA public exports for UI.
- Does not use \`StyleSheet\` or direct Surface imports.
- Installs the published \`@ankhorage/zora\` package.
`,
  );
}

function scaffold(options: ScaffoldOptions): void {
  const repoRoot = process.cwd();
  const targetDir = resolve(repoRoot, 'examples', options.category, options.exampleId);

  if (existsSync(targetDir)) {
    throw new Error(`Target already exists: ${targetDir}`);
  }

  mkdirSync(dirname(targetDir), { recursive: true });

  run('bunx', ['create-expo-app@latest', targetDir, '--template', 'default', '--yes'], repoRoot);
  createAppFiles(options, targetDir);
  run('bun', ['install'], targetDir);

  console.log(`Created ${targetDir}`);
}

scaffold(parseArgs(process.argv.slice(2)));
