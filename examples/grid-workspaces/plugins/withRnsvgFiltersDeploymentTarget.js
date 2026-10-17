const { withPodfile } = require('expo/config-plugins');

const MARKER = '# withRnsvgFiltersDeploymentTarget';

/**
 * Xcode 27 rejects react-native-svg's RNSVGFilters resource bundle because its podspec declares
 * iOS 12.4 (react-native-svg #2992, react-native #58555). Raises only that target to the app's
 * minimum so generated projects build without hand-editing the Podfile.
 */
function patchPodfile(contents, deploymentTarget) {
  if (contents.includes(MARKER)) return contents;
  const postInstall = /^( *)react_native_post_install\([\s\S]*?^\1\)\n/m.exec(contents);
  if (postInstall === null) {
    throw new Error('withRnsvgFiltersDeploymentTarget could not find react_native_post_install.');
  }
  const indent = postInstall[1];
  const block = [
    '',
    `${indent}${MARKER}`,
    `${indent}installer.pods_project.targets.each do |target|`,
    `${indent}  next unless target.name == 'RNSVG-RNSVGFilters'`,
    `${indent}  target.build_configurations.each do |build_configuration|`,
    `${indent}    build_configuration.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${deploymentTarget}'`,
    `${indent}  end`,
    `${indent}end`,
    '',
  ].join('\n');
  const end = postInstall.index + postInstall[0].length;
  return `${contents.slice(0, end)}${block}${contents.slice(end)}`;
}

function withRnsvgFiltersDeploymentTarget(config, { deploymentTarget = '16.4' } = {}) {
  return withPodfile(config, (podfileConfig) => {
    podfileConfig.modResults.contents = patchPodfile(
      podfileConfig.modResults.contents,
      deploymentTarget,
    );
    return podfileConfig;
  });
}

module.exports = withRnsvgFiltersDeploymentTarget;
