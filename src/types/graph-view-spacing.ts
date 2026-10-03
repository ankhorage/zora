export interface GraphSpacingFitOptions {
  readonly fitPadding?: number;
  readonly maxFitZoom?: number;
}

export interface GraphSpacingCandidate {
  readonly effectiveFitZoom: number;
  readonly hardCollision: boolean;
  readonly renderedBackgroundOverlap: number;
}

export interface GraphSpacingEvaluator {
  readonly evaluate: (factor: number) => GraphSpacingCandidate;
  readonly apply: (factor: number) => void;
}
