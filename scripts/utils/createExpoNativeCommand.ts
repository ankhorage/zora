type NativePlatform = 'android' | 'ios';

const defaultMetroPort = 8081;

/** Create the supported Expo 57 command that launches a native build against the default debug server. */
export function createExpoNativeRunCommand(platform: NativePlatform): readonly string[] {
  return ['bunx', 'expo', `run:${platform}`, '--no-bundler'];
}

/** Create the owned Metro command whose default port is the native debug-runtime contract. */
export function createExpoMetroCommand(): readonly string[] {
  return ['bunx', 'expo', 'start', '--localhost', '--port', String(defaultMetroPort)];
}

/** Expose the one supported no-bundler Metro port for readiness and device-routing checks. */
export function getExpoNativeMetroPort() {
  return defaultMetroPort;
}
