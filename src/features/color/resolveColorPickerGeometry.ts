const MINIMUM_WIDTH = 360;
const REFERENCE_WIDTH = 560;

/*** Resolves one coherent ColorPicker geometry from the host's actual available bounds. */
export function resolveColorPickerGeometry(input: {
  readonly height?: number;
  readonly hostHeight?: number;
  readonly hostWidth?: number;
  readonly showTabs: boolean;
  readonly width?: number;
}) {
  const availableWidth = Math.min(
    input.width ?? REFERENCE_WIDTH,
    input.hostWidth ?? REFERENCE_WIDTH,
  );
  const availableHeight = Math.min(
    input.height ?? Number.POSITIVE_INFINITY,
    input.hostHeight ?? Number.POSITIVE_INFINITY,
  );
  const minimum = resolveGeometryAtWidth(MINIMUM_WIDTH, input.showTabs);
  const maximum = resolveGeometryAtWidth(Math.max(MINIMUM_WIDTH, availableWidth), input.showTabs);
  const resolved = resolveLargestGeometry(maximum, availableHeight, input.showTabs);

  return {
    ...resolved,
    insufficientSpace: availableWidth < MINIMUM_WIDTH || availableHeight < minimum.height,
    minimumHeight: minimum.height,
    minimumWidth: MINIMUM_WIDTH,
  };
}

/*** Calculates every descendant measurement from a single continuous logical width. */
function resolveGeometryAtWidth(width: number, showTabs: boolean) {
  const progress = Math.max(
    0,
    Math.min(1, (width - MINIMUM_WIDTH) / (REFERENCE_WIDTH - MINIMUM_WIDTH)),
  );
  const padding = interpolate(12, 24, progress);
  const rail = interpolate(104, 150, progress);
  const gap = interpolate(12, 20, progress);
  const scale = interpolate(0.75, 1, progress);
  const border = 1;
  const stage = width - border * 2 - padding * 2 - rail - gap;
  const headerHeight = 48 * scale;
  const tabHeight = showTabs ? 48 * scale : 0;
  const cardGap = 16 * scale;
  const cardHeight = 52 * scale;
  const settingsHeight = cardHeight * 2 + cardGap;
  const mainHeight = Math.max(stage, settingsHeight);
  const infoLineHeight = 20 * scale;
  const mainGap = 16 * scale;
  const footerGap = 10 * scale;
  const footerHeight = 52 * scale;
  const height =
    border * 2 +
    padding * 2 +
    headerHeight +
    mainGap +
    tabHeight +
    (showTabs ? mainGap : 0) +
    mainHeight +
    mainGap +
    infoLineHeight +
    footerGap +
    1 +
    footerGap +
    footerHeight +
    footerGap;

  return {
    border,
    cardGap,
    cardHeight,
    footerGap,
    footerHeight,
    gap,
    headerHeight,
    height,
    infoLineHeight,
    mainGap,
    padding,
    rail,
    scale,
    settingsHeight,
    stage,
    tabHeight,
    width,
  };
}

/*** Finds the largest coherent width geometry that fits the available host height. */
function resolveLargestGeometry(
  maximum: ReturnType<typeof resolveGeometryAtWidth>,
  height: number,
  showTabs: boolean,
) {
  if (!Number.isFinite(height) || maximum.height <= height) return maximum;
  const minimum = resolveGeometryAtWidth(MINIMUM_WIDTH, showTabs);
  if (height < minimum.height) return minimum;

  let lower = MINIMUM_WIDTH;
  let upper = maximum.width;
  for (let iteration = 0; iteration < 20; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    if (resolveGeometryAtWidth(midpoint, showTabs).height <= height) lower = midpoint;
    else upper = midpoint;
  }
  return resolveGeometryAtWidth(lower, showTabs);
}

/*** Interpolates a reference measurement without changing component hierarchy. */
function interpolate(minimum: number, reference: number, progress: number) {
  return minimum + (reference - minimum) * progress;
}
