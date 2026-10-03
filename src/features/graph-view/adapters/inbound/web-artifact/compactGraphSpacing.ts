import type { Core } from 'cytoscape';

import type {
  GraphSpacingCandidate,
  GraphSpacingFitOptions,
} from '../../../../../types/graph-view-spacing';
import { createGraphSpacingEvaluator } from './createGraphSpacingEvaluator';

const MAX_EXPANSION_ATTEMPTS = 8;
const MAX_NODE_COUNT = 2000;
const MAX_RENDERED_BACKGROUND_OVERLAP = 4;
const SEARCH_ITERATIONS = 8;
const ZERO_TOLERANCE = 0.001;

/***
 * Optimize settled spacing for useful rendered scale instead of minimum model-space distance.
 * A graph already at its fit-size target remains unchanged. When compaction is useful, semantic
 * label/compound collisions stay forbidden; only dense graphs may spend up to four rendered pixels
 * of decorative leaf-background overlap. Locked/large views retain their settled geometry.
 */
export function compactGraphSpacing(
  cy: Core,
  spacingFactor: number,
  options: GraphSpacingFitOptions = {},
): number {
  if (
    spacingFactor <= 0 ||
    cy.nodes(':childless').length < 2 ||
    cy.nodes().length > MAX_NODE_COUNT ||
    cy.nodes(':locked').length > 0
  )
    return spacingFactor;

  const evaluator = createGraphSpacingEvaluator(cy, options);
  if (evaluator === null) return spacingFactor;
  const current = evaluator.evaluate(1);
  const maxFitZoom = options.maxFitZoom ?? Infinity;
  const minReadableZoom = options.minReadableZoom ?? 0;
  const factor = needsExpansion(current)
    ? chooseExpansionFactor(evaluator.evaluate, minReadableZoom)
    : chooseCompactionFactor(
        evaluator.evaluate,
        spacingFactor,
        maxFitZoom,
        minReadableZoom,
        current,
      );
  if (factor === 1) return spacingFactor;

  evaluator.apply(factor);
  return spacingFactor * factor;
}

/*** Choose a smaller factor only while it improves rendered fit or reaches the configured cap. */
function chooseCompactionFactor(
  evaluate: (factor: number) => GraphSpacingCandidate,
  spacingFactor: number,
  maxFitZoom: number,
  minReadableZoom: number,
  current: GraphSpacingCandidate,
): number {
  if (reachesFitTarget(current, maxFitZoom)) return 1;

  const minimum = Math.min(1, 0.1 / spacingFactor);
  if (current.renderedBackgroundOverlap > ZERO_TOLERANCE) {
    if (reachesReadableTarget(current, minReadableZoom)) return 1;
    return chooseSoftCompactionFactor(evaluate, minimum, 1, minReadableZoom);
  }

  const strictMinimum = findMinimumAcceptedFactor(minimum, 1, (factor) =>
    isStrictCandidate(evaluate(factor)),
  );
  if (strictMinimum === undefined) return 1;

  const strict = evaluate(strictMinimum);
  if (reachesFitTarget(strict, maxFitZoom)) {
    return (
      findMaximumAcceptedFactor(strictMinimum, 1, (factor) => {
        const candidate = evaluate(factor);
        return isStrictCandidate(candidate) && reachesFitTarget(candidate, maxFitZoom);
      }) ?? strictMinimum
    );
  }
  if (reachesReadableTarget(strict, minReadableZoom)) return strictMinimum;

  return chooseSoftCompactionFactor(evaluate, minimum, strictMinimum, minReadableZoom);
}

/*** Spend background-overlap budget only to recover the configured readable-label threshold. */
function chooseSoftCompactionFactor(
  evaluate: (factor: number) => GraphSpacingCandidate,
  minimum: number,
  maximum: number,
  minReadableZoom: number,
): number {
  const softMinimum = findMinimumAcceptedFactor(minimum, maximum, (factor) =>
    isSoftCandidate(evaluate(factor)),
  );
  if (softMinimum === undefined) return maximum;

  const soft = evaluate(softMinimum);
  if (!reachesReadableTarget(soft, minReadableZoom)) return softMinimum;
  return (
    findMaximumAcceptedFactor(softMinimum, maximum, (factor) => {
      const candidate = evaluate(factor);
      return isSoftCandidate(candidate) && reachesReadableTarget(candidate, minReadableZoom);
    }) ?? softMinimum
  );
}

/*** Expand only enough to restore strict geometry unless that would sacrifice readable labels. */
function chooseExpansionFactor(
  evaluate: (factor: number) => GraphSpacingCandidate,
  minReadableZoom: number,
): number {
  const strict = findExpansionFactor((factor) => isStrictCandidate(evaluate(factor)));
  if (strict !== undefined && reachesReadableTarget(evaluate(strict), minReadableZoom))
    return strict;
  return findExpansionFactor((factor) => isSoftCandidate(evaluate(factor))) ?? strict ?? 1;
}

/*** Return whether a candidate is collision-free, including decorative leaf backgrounds. */
function isStrictCandidate(candidate: GraphSpacingCandidate): boolean {
  return !candidate.hardCollision && candidate.renderedBackgroundOverlap <= ZERO_TOLERANCE;
}

/*** Allow only bounded rendered-pixel background overlap as a dense-graph fallback. */
function isSoftCandidate(candidate: GraphSpacingCandidate): boolean {
  return (
    !candidate.hardCollision &&
    candidate.renderedBackgroundOverlap <= MAX_RENDERED_BACKGROUND_OVERLAP + ZERO_TOLERANCE
  );
}

/*** Detect whether current geometry must expand before compaction can be considered. */
function needsExpansion(candidate: GraphSpacingCandidate): boolean {
  return candidate.hardCollision || !isSoftCandidate(candidate);
}

/*** Treat a finite fit-size ceiling as the point after which tighter spacing cannot improve output. */
function reachesFitTarget(candidate: GraphSpacingCandidate, maxFitZoom: number): boolean {
  if (!Number.isFinite(maxFitZoom)) return false;
  return candidate.effectiveFitZoom >= maxFitZoom - ZERO_TOLERANCE;
}

/*** Return whether full-graph fit keeps semantic labels at the configured readable threshold. */
function reachesReadableTarget(candidate: GraphSpacingCandidate, minReadableZoom: number): boolean {
  return minReadableZoom <= 0 || candidate.effectiveFitZoom >= minReadableZoom - ZERO_TOLERANCE;
}

/*** Binary-search the smallest factor accepted by a monotonic spacing constraint. */
function findMinimumAcceptedFactor(
  minimum: number,
  maximum: number,
  accepts: (factor: number) => boolean,
): number | undefined {
  if (!accepts(maximum)) return undefined;
  if (accepts(minimum)) return minimum;
  return Array.from({ length: SEARCH_ITERATIONS }).reduce<{ low: number; high: number }>(
    (range) => {
      const factor = (range.low + range.high) / 2;
      return accepts(factor) ? { low: range.low, high: factor } : { low: factor, high: range.high };
    },
    { low: minimum, high: maximum },
  ).high;
}

/*** Binary-search the largest factor that still reaches a target under its collision policy. */
function findMaximumAcceptedFactor(
  minimum: number,
  maximum: number,
  accepts: (factor: number) => boolean,
): number | undefined {
  if (!accepts(minimum)) return undefined;
  if (accepts(maximum)) return maximum;
  return Array.from({ length: SEARCH_ITERATIONS }).reduce<{ low: number; high: number }>(
    (range) => {
      const factor = (range.low + range.high) / 2;
      return accepts(factor) ? { low: factor, high: range.high } : { low: range.low, high: factor };
    },
    { low: minimum, high: maximum },
  ).low;
}

/*** Find the first bounded expansion threshold and refine it without unbounded layout work. */
function findExpansionFactor(accepts: (factor: number) => boolean): number | undefined {
  if (accepts(1)) return 1;
  const maximum = Array.from(
    { length: MAX_EXPANSION_ATTEMPTS },
    (_, index) => 2 ** (index + 1),
  ).find(accepts);
  if (maximum === undefined) return undefined;
  return findMinimumAcceptedFactor(maximum / 2, maximum, accepts);
}
