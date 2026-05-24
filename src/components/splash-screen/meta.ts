import type { ZoraComponentMeta } from '../../metadata';

export const splashScreenMeta = {
  name: 'SplashScreen',
  category: 'component',
  directManifestNode: false,
  allowedChildren: [],
  note: 'React-rendered branded loading and preview surface; native splash configuration is generated outside ZORA.',
  props: {},
} as const satisfies ZoraComponentMeta;
