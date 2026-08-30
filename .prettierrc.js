import sharedConfig from '@ankhorage/devtools/prettier';
import localConfig from './prettier.local.config.js';

export default {
  ...sharedConfig,
  ...localConfig,
  overrides: [...(sharedConfig.overrides ?? []), ...(localConfig.overrides ?? [])],
};
