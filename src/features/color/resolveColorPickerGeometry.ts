/*** Resolves the single width-and-height geometry contract for the complete ColorPicker. */
export function resolveColorPickerGeometry(input: {
  readonly height?: number;
  readonly hostHeight?: number;
  readonly hostWidth?: number;
  readonly showTabs: boolean;
  readonly width?: number;
}) {
  const widthLimit = Math.min(input.width ?? 560, input.hostWidth ?? Number.POSITIVE_INFINITY);
  const heightLimit = Math.min(
    input.height ?? Number.POSITIVE_INFINITY,
    input.hostHeight ?? Number.POSITIVE_INFINITY,
  );
  const referenceScale = Math.max(0, Math.min(1, (Math.min(widthLimit, 560) - 360) / 200));
  const padding = 12 + referenceScale * 12;
  const rail = 104 + referenceScale * 46;
  const gap = 12 + referenceScale * 8;
  const border = 1;
  const header = 48;
  const tabs = input.showTabs ? 48 : 0;
  const infoLine = 20;
  const divider = 1;
  const footer = 52;
  const footerGap = 10;
  const settingsHeight = 116;
  const widthStage = widthLimit - border * 2 - padding * 2 - rail - gap;
  const heightStage =
    heightLimit -
    border * 2 -
    padding * 2 -
    header -
    tabs -
    infoLine -
    divider -
    footer -
    footerGap * 3;
  const stage = Math.max(0, Math.min(widthStage, heightStage));
  const mainHeight = Math.max(stage, settingsHeight);
  const height =
    border * 2 +
    padding * 2 +
    header +
    tabs +
    mainHeight +
    infoLine +
    divider +
    footer +
    footerGap * 3;
  const width = border * 2 + padding * 2 + rail + gap + stage;

  return {
    footerGap,
    gap,
    height,
    insufficientSpace: stage < 176 || widthLimit < 360 || heightLimit < 360,
    padding,
    rail,
    stage,
    width,
  };
}
