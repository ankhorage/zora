import { expect, mock, test } from 'bun:test';

let patchedPodfile = '';
let podfileContents = '';

mock.module('expo/config-plugins', () => ({
  withPodfile: (
    config: Record<string, unknown>,
    applyPodfile: (podfileConfig: { modResults: { contents: string } }) => {
      modResults: { contents: string };
    },
  ) => {
    patchedPodfile = applyPodfile({ modResults: { contents: podfileContents } }).modResults
      .contents;
    return config;
  },
}));

const withRnsvgFiltersDeploymentTarget = require('./withRnsvgFiltersDeploymentTarget') as (
  config: Record<string, unknown>,
  options: { deploymentTarget: string },
) => Record<string, unknown>;

const podfile = `target 'app' do
  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
    )
  end
end
`;

test('raises only the RNSVGFilters resource bundle after react_native_post_install', () => {
  const patched = patchPodfile('16.4');

  expect(patched).toContain("next unless target.name == 'RNSVG-RNSVGFilters'");
  expect(patched).toContain("['IPHONEOS_DEPLOYMENT_TARGET'] = '16.4'");
  expect(patched.indexOf('react_native_post_install(')).toBeLessThan(
    patched.indexOf('RNSVG-RNSVGFilters'),
  );
  expect(patched.indexOf('RNSVG-RNSVGFilters')).toBeLessThan(patched.indexOf('  end\nend'));
});

test('is idempotent across repeated prebuilds', () => {
  const once = patchPodfile('16.4');

  expect(patchPodfile('16.4', once)).toBe(once);
});

test('fails loudly when the Podfile has no react_native_post_install anchor', () => {
  expect(() => patchPodfile('16.4', "target 'app' do\nend\n")).toThrow(
    'could not find react_native_post_install',
  );
});

/** Runs the public config plugin against a supplied generated Podfile. */
function patchPodfile(deploymentTarget: string, contents = podfile) {
  patchedPodfile = '';
  podfileContents = contents;
  withRnsvgFiltersDeploymentTarget({}, { deploymentTarget });
  return patchedPodfile;
}
