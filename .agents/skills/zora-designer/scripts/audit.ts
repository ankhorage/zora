#!/usr/bin/env bun

import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const RUBRIC_URL = new URL('../assets/audit-rubric.json', import.meta.url);
const HUMAN_SECTIONS = [
  'Design direction',
  'Resolved decisions and origins',
  'Color system',
  'Typography',
  'Layout, shape, elevation, and motion',
  'Component and interaction states',
  'Screen specifications',
  'Accessibility and validation',
  'Audit summary',
  'Findings and remediation',
  'Risks needing verification',
  'Not assessable',
  'Open decisions',
  'User notes',
];

interface AuditRubric {
  confidenceFactors: Record<string, number>;
  releaseGates: ReleaseGateDefinition[];
  rules: RuleDefinition[];
  statusFactors: Record<string, number | null>;
}

interface RuleDefinition {
  criteria: string[];
  id: string;
  name: string;
  weight: number;
}

interface ReleaseGateDefinition {
  criteria: string[];
  id: string;
  name: string;
}

interface EvidenceItem extends Record<string, unknown> {
  confidence: string;
  confidenceFactor: number;
  evidenceLevel: string;
  id: string;
  kind: string;
  limitations: unknown[];
  location: string;
  observation: string;
  reproduction: string;
}

interface CriterionResult {
  applicable: boolean;
  confidenceFactor: number | null;
  essentialEvidenceIds: string[];
  evidenceIds: string[];
  id: string;
  reason: string;
  status: string;
  statusFactor: number | null;
}

interface RuleResult {
  applicableCount: number;
  assessedCount: number;
  assessedWeight: number;
  assessmentFraction: number | null;
  confidence: { label: string | null; value: number | null };
  criteria: CriterionResult[];
  earnedWeight: number;
  name: string;
  rule: string;
  status: string;
  statusFactor: number | null;
  weight: number;
}

interface ReleaseGateResult {
  applicable: boolean;
  criteria: {
    applicable: boolean;
    evidenceIds: string[];
    id: string;
    reason: string;
    status: string;
  }[];
  evidenceIds: string[];
  id: string;
  name: string;
  reason: string;
  status: string;
}

interface Finding extends Record<string, unknown> {
  confidence: string;
  criterionId: string;
  evidence: string;
  evidenceIds: string[];
  evidenceLevel: string;
  expected: string;
  fix: string;
  id: string;
  impact: string;
  location: string;
  relatedRules: unknown[];
  rootCause: string;
  rule: string;
  severity: string;
  verification: string;
}

interface AuditTotals {
  applicableWeight: number;
  assessedWeight: number;
  confidence: number | null;
  earnedWeight: number;
  possibleRange: { lower: number | null; upper: number | null };
  score: number | null;
  coverage: number | null;
}

/*** Load the single canonical audit rubric and verify its invariant total weight. */
export async function loadAuditRubric(): Promise<AuditRubric> {
  const rubric: unknown = JSON.parse(await readFile(RUBRIC_URL, 'utf8'));
  assertAuditRubric(rubric);
  const totalWeight = rubric.rules.reduce((sum, rule) => sum + rule.weight, 0);
  if (totalWeight !== 100) {
    throw new Error(`Canonical zora-designer rubric weight must equal 100; found ${totalWeight}.`);
  }
  return rubric;
}

/*** Calculate criterion, rule, coverage, confidence, score range, finding impact, and release gates. */
export async function calculateAudit(input: unknown) {
  assertRecord(input, 'Audit input');
  const rubric = await loadAuditRubric();
  const evidence = Array.isArray(input.evidence) ? input.evidence : [];
  const evidenceById = validateEvidence(evidence, rubric.confidenceFactors);
  const assessments = isRecord(input.criteria) ? input.criteria : {};
  const ruleResults = rubric.rules.map((rule) =>
    calculateRule(rule, assessments[rule.id], evidenceById, rubric.statusFactors),
  );
  const totals = calculateTotals(ruleResults);
  const releaseGateInputs = isRecord(input.releaseGates) ? input.releaseGates : {};
  const releaseGateCriteria = rubric.releaseGates.map((gate) =>
    calculateReleaseGate(gate, releaseGateInputs[gate.id], evidenceById),
  );
  const releaseGate = calculateAggregateReleaseGate(releaseGateCriteria);
  const findings = allocateFindingImpacts(
    Array.isArray(input.findings) ? input.findings : [],
    ruleResults,
    totals.applicableWeight,
    evidenceById,
  );

  return {
    status: totals.assessedWeight === totals.applicableWeight ? 'complete' : 'partial',
    score: totals.score,
    coverage: totals.coverage,
    coverageLabel: labelCoverage(totals.coverage),
    provisional: totals.coverage !== null && totals.coverage < 60,
    applicableWeight: totals.applicableWeight,
    assessedWeight: roundDecimal(totals.assessedWeight, 4),
    earnedWeight: roundDecimal(totals.earnedWeight, 4),
    rounding: 'half-up',
    confidence: {
      value: totals.confidence === null ? null : roundDecimal(totals.confidence, 4),
      label: labelConfidence(totals.confidence),
    },
    possibleRange: totals.possibleRange,
    releaseGate,
    releaseGateCriteria,
    ruleResults,
    findings,
    risks: Array.isArray(input.risks) ? input.risks.map(normalizeRisk) : [],
    passedRules: ruleResults
      .filter((rule) => rule.assessmentFraction === 1 && rule.status === 'pass')
      .map((rule) => rule.rule),
    notAssessable: ruleResults.flatMap((rule) =>
      rule.criteria
        .filter((criterion) => criterion.applicable && criterion.status === 'not-assessable')
        .map((criterion) => ({
          rule: rule.rule,
          criterionId: criterion.id,
          missingEvidence: criterion.reason,
        })),
    ),
  };
}

/*** Serialize one stable configuration or audit artifact using JSON-compatible YAML frontmatter. */
export function serializeArtifact(input: unknown, audit: unknown) {
  assertRecord(input, 'Artifact input');
  const documentKind = input.documentKind === 'audit' ? 'audit' : 'configuration';
  const frontmatter = {
    schema: 'zora-designer/v1',
    documentKind,
    status: input.status ?? (documentKind === 'audit' ? 'audited' : 'draft'),
    language: input.language ?? 'en',
    source: input.source ?? { mode: documentKind, inputs: [], evidence: [] },
    config: input.config ?? {},
    derivation: input.derivation ?? {
      provenance: [],
      diagnostics: [],
      assumptions: [],
      unsupported: [],
      ownerRuntimeDrift: [],
    },
    tokens: input.tokens ?? {},
    components: input.components ?? { stateRequirements: [], recipeDecisions: {} },
    screens: input.screens ?? [],
    assets: input.assets ?? { bundlePath: null, status: 'not-run', entries: [] },
    validation: input.validation ?? {
      scope: documentKind === 'audit' ? 'audit' : 'configuration',
      status: 'not-run',
      gates: [],
      applicationGate: 'not-assessable',
      ownerRuntimeDrift: [],
      blockers: [],
    },
    audit: audit ?? {
      status: 'not-run',
      score: null,
      coverage: null,
      applicableWeight: null,
      assessedWeight: null,
      rounding: 'half-up',
      confidence: { value: null, label: null },
      possibleRange: { lower: null, upper: null },
      releaseGate: 'not-assessable',
      releaseGateCriteria: [],
      ruleResults: [],
      findings: [],
      risks: [],
      passedRules: [],
      notAssessable: [],
    },
    openDecisions: input.openDecisions ?? [],
  };
  const summaries = isRecord(input.summarySections) ? input.summarySections : {};
  const report = HUMAN_SECTIONS.map((section) => {
    const value = section === 'User notes' ? input.userNotes : summaries[section];
    return `## ${section}\n\n${typeof value === 'string' ? value : ''}`;
  }).join('\n\n');
  return `---\n${JSON.stringify(frontmatter, null, 2)}\n---\n\n# ZORA Designer\n\n${report}\n`;
}

/*** Calculate all four canonical criteria and derived values for one weighted rule. */
function calculateRule(
  rule: RuleDefinition,
  rawAssessments: unknown,
  evidenceById: Map<string, EvidenceItem>,
  statusFactors: Record<string, number | null>,
): RuleResult {
  const assessmentRecord = isRecord(rawAssessments) ? rawAssessments : {};
  const criteria = rule.criteria.map((criterionId) =>
    normalizeCriterion(criterionId, assessmentRecord[criterionId], evidenceById, statusFactors),
  );
  const applicable = criteria.filter((criterion) => criterion.applicable);
  const assessed = applicable.filter(isAssessedCriterion);
  const applicableCount = applicable.length;
  const assessedCount = assessed.length;
  const assessmentFraction = applicableCount === 0 ? null : assessedCount / applicableCount;
  const statusFactor =
    assessedCount === 0
      ? null
      : assessed.reduce((sum, criterion) => sum + criterion.statusFactor, 0) / assessedCount;
  const criterionWeight = applicableCount === 0 ? 0 : rule.weight / applicableCount;
  const assessedWeight = criterionWeight * assessedCount;
  const earnedWeight =
    criterionWeight * assessed.reduce((sum, criterion) => sum + criterion.statusFactor, 0);
  const confidenceValue =
    assessedCount === 0
      ? null
      : assessed.reduce((sum, criterion) => sum + criterion.confidenceFactor, 0) / assessedCount;

  return {
    rule: rule.id,
    name: rule.name,
    weight: rule.weight,
    status: labelRuleStatus(criteria, statusFactor, applicableCount),
    statusFactor: statusFactor === null ? null : roundDecimal(statusFactor, 4),
    applicableCount,
    assessedCount,
    assessmentFraction: assessmentFraction === null ? null : roundDecimal(assessmentFraction, 4),
    confidence: {
      value: confidenceValue === null ? null : roundDecimal(confidenceValue, 4),
      label: labelConfidence(confidenceValue),
    },
    assessedWeight: roundDecimal(assessedWeight, 4),
    earnedWeight: roundDecimal(earnedWeight, 4),
    criteria,
  };
}

/*** Normalize one criterion and derive confidence only from its essential evidence. */
function normalizeCriterion(
  criterionId: string,
  rawAssessment: unknown,
  evidenceById: Map<string, EvidenceItem>,
  statusFactors: Record<string, number | null>,
): CriterionResult {
  const assessment = isRecord(rawAssessment) ? rawAssessment : {};
  const applicable = assessment.applicable !== false;
  const requestedStatus =
    typeof assessment.status === 'string' ? assessment.status : 'not-assessable';
  const status = applicable ? requestedStatus : 'not-applicable';
  if (!(status in statusFactors)) {
    throw new Error(`Unknown audit criterion status for ${criterionId}: ${status}`);
  }
  if (applicable && status === 'not-applicable') {
    throw new Error(`Applicable criterion ${criterionId} cannot be not-applicable.`);
  }
  const statusFactor = statusFactors[status];
  const evidenceIds = readStringArray(assessment.evidenceIds);
  const essentialEvidenceIds = readStringArray(assessment.essentialEvidenceIds);
  if (statusFactor !== null && essentialEvidenceIds.length === 0) {
    throw new Error(`Assessed criterion ${criterionId} requires essentialEvidenceIds.`);
  }
  if (essentialEvidenceIds.some((evidenceId) => !evidenceIds.includes(evidenceId))) {
    throw new Error(
      `Criterion ${criterionId} essentialEvidenceIds must be a subset of evidenceIds.`,
    );
  }
  for (const evidenceId of [...evidenceIds, ...essentialEvidenceIds]) {
    if (!evidenceById.has(evidenceId)) {
      throw new Error(`Criterion ${criterionId} references unknown evidence: ${evidenceId}`);
    }
  }
  const confidenceFactor =
    statusFactor === null
      ? null
      : Math.min(
          ...essentialEvidenceIds.map(
            (evidenceId) => evidenceById.get(evidenceId)?.confidenceFactor ?? 0,
          ),
        );
  return {
    id: criterionId,
    applicable,
    status,
    statusFactor,
    evidenceIds,
    essentialEvidenceIds,
    confidenceFactor,
    reason:
      typeof assessment.reason === 'string' && assessment.reason !== ''
        ? assessment.reason
        : status === 'not-assessable'
          ? 'Required evidence was not supplied.'
          : '',
  };
}

/*** Calculate aggregate score, coverage, range, and confidence from rule results. */
function calculateTotals(ruleResults: RuleResult[]): AuditTotals {
  const applicableRules = ruleResults.filter((rule) => rule.applicableCount > 0);
  const applicableWeight = applicableRules.reduce((sum, rule) => sum + rule.weight, 0);
  const assessedWeight = ruleResults.reduce(
    (sum, rule) =>
      sum +
      (rule.applicableCount === 0 ? 0 : (rule.weight / rule.applicableCount) * rule.assessedCount),
    0,
  );
  const earnedWeight = ruleResults.reduce(
    (sum, rule) =>
      sum +
      (rule.applicableCount === 0
        ? 0
        : (rule.weight / rule.applicableCount) *
          rule.criteria
            .filter(isAssessedCriterion)
            .reduce((criterionSum, criterion) => criterionSum + criterion.statusFactor, 0)),
    0,
  );
  if (applicableWeight === 0) {
    return {
      applicableWeight: 0,
      assessedWeight: 0,
      earnedWeight: 0,
      score: null,
      coverage: null,
      confidence: null,
      possibleRange: { lower: null, upper: null },
    };
  }
  if (assessedWeight === 0) {
    return {
      applicableWeight,
      assessedWeight,
      earnedWeight,
      score: null,
      coverage: 0,
      confidence: null,
      possibleRange: { lower: 0, upper: 100 },
    };
  }
  const confidenceNumerator = ruleResults.reduce((sum, rule) => {
    const { applicableCount } = rule;
    if (applicableCount === 0) return sum;
    const criterionWeight = rule.weight / applicableCount;
    return (
      sum +
      criterionWeight *
        rule.criteria
          .filter(isAssessedCriterion)
          .reduce((criterionSum, criterion) => criterionSum + criterion.confidenceFactor, 0)
    );
  }, 0);
  return {
    applicableWeight,
    assessedWeight,
    earnedWeight,
    score: roundHalfUp((100 * earnedWeight) / assessedWeight),
    coverage: roundHalfUp((100 * assessedWeight) / applicableWeight),
    confidence: confidenceNumerator / assessedWeight,
    possibleRange: {
      lower: roundHalfUp((100 * earnedWeight) / applicableWeight),
      upper: roundHalfUp(
        (100 * (earnedWeight + applicableWeight - assessedWeight)) / applicableWeight,
      ),
    },
  };
}

/*** Validate evidence identities and canonical confidence factors. */
function validateEvidence(
  evidence: unknown[],
  confidenceFactors: Record<string, number>,
): Map<string, EvidenceItem> {
  const evidenceById = new Map<string, EvidenceItem>();
  for (const item of evidence) {
    assertRecord(item, 'Evidence item');
    assertEvidenceItem(item);
    if (typeof item.id !== 'string' || item.id === '') {
      throw new Error('Every evidence item requires a non-empty id.');
    }
    if (evidenceById.has(item.id)) {
      throw new Error(`Duplicate evidence id: ${item.id}`);
    }
    for (const field of ['kind', 'location', 'observation', 'evidenceLevel', 'reproduction']) {
      if (typeof item[field] !== 'string' || item[field] === '') {
        throw new Error(`Evidence ${item.id} requires a non-empty ${field}.`);
      }
    }
    if (
      !['measured', 'observed', 'estimated', 'inferred', 'not-assessable'].includes(
        item.evidenceLevel,
      )
    ) {
      throw new Error(`Evidence ${item.id} has unknown evidenceLevel: ${item.evidenceLevel}`);
    }
    if (!Array.isArray(item.limitations)) {
      throw new Error(`Evidence ${item.id} requires a limitations list.`);
    }
    if (!(item.confidence in confidenceFactors)) {
      throw new Error(`Evidence ${item.id} has unknown confidence: ${String(item.confidence)}`);
    }
    const canonicalFactor = confidenceFactors[item.confidence];
    if (item.confidenceFactor !== canonicalFactor) {
      throw new Error(
        `Evidence ${item.id} confidenceFactor must be ${canonicalFactor} for ${item.confidence}.`,
      );
    }
    evidenceById.set(item.id, item);
  }
  return evidenceById;
}

/*** Derive one canonical release item from all of its subcriteria. */
function calculateReleaseGate(
  gate: ReleaseGateDefinition,
  rawGate: unknown,
  evidenceById: Map<string, EvidenceItem>,
): ReleaseGateResult {
  const gateInput = isRecord(rawGate) ? rawGate : {};
  const rawCriteria = isRecord(gateInput.criteria) ? gateInput.criteria : {};
  const criteria = gate.criteria.map((criterionId) => {
    const raw = isRecord(rawCriteria[criterionId]) ? rawCriteria[criterionId] : {};
    const applicable = raw.applicable !== false;
    const status = applicable ? readReleaseCriterionStatus(raw.status) : 'not-applicable';
    const evidenceIds = readStringArray(raw.evidenceIds);
    if (['pass', 'fail'].includes(status) && evidenceIds.length === 0) {
      throw new Error(`Release criterion ${criterionId} requires evidence for status ${status}.`);
    }
    for (const evidenceId of evidenceIds) {
      if (!evidenceById.has(evidenceId)) {
        throw new Error(
          `Release criterion ${criterionId} references unknown evidence: ${evidenceId}`,
        );
      }
    }
    return {
      id: criterionId,
      applicable,
      status,
      evidenceIds,
      reason: typeof raw.reason === 'string' ? raw.reason : '',
    };
  });
  const applicableCriteria = criteria.filter((criterion) => criterion.applicable);
  const status =
    applicableCriteria.length === 0
      ? 'not-applicable'
      : applicableCriteria.some((criterion) => criterion.status === 'fail')
        ? 'fail'
        : applicableCriteria.every((criterion) => criterion.status === 'pass')
          ? 'pass'
          : 'not-assessable';
  return {
    id: gate.id,
    name: gate.name,
    applicable: applicableCriteria.length > 0,
    status,
    evidenceIds: [...new Set(criteria.flatMap((criterion) => criterion.evidenceIds))].sort(),
    reason: typeof gateInput.reason === 'string' ? gateInput.reason : '',
    criteria,
  };
}

/*** Derive the aggregate release gate without allowing the score to override evidence gaps. */
function calculateAggregateReleaseGate(releaseGates: ReleaseGateResult[]): string {
  const applicable = releaseGates.filter((gate) => gate.applicable);
  if (applicable.length === 0) return 'not-assessable';
  if (applicable.some((gate) => gate.status === 'fail')) return 'fail';
  if (applicable.every((gate) => gate.status === 'pass')) return 'pass';
  return 'not-assessable';
}

/*** Deduplicate findings by root cause and allocate each criterion loss in stable units. */
function allocateFindingImpacts(
  findings: unknown[],
  ruleResults: RuleResult[],
  applicableWeight: number,
  evidenceById: Map<string, EvidenceItem>,
) {
  const normalizedFindings = findings.map((finding) => {
    assertRecord(finding, 'Finding');
    validateFinding(finding, evidenceById);
    return finding;
  });
  const deduplicated: Finding[] = [];
  const seenRootCauses = new Set<string>();
  for (const finding of normalizedFindings.sort((left, right) => left.id.localeCompare(right.id))) {
    const rootCause = typeof finding.rootCause === 'string' ? finding.rootCause : finding.id;
    if (!seenRootCauses.has(rootCause)) {
      seenRootCauses.add(rootCause);
      deduplicated.push({ ...finding, rootCause });
    }
  }
  const byCriterion = new Map<string, Finding[]>();
  for (const finding of deduplicated) {
    const key = `${finding.rule}:${finding.criterionId}`;
    byCriterion.set(key, [...(byCriterion.get(key) ?? []), finding]);
  }
  const allocations = new Map<string, number>();
  for (const [key, criterionFindings] of byCriterion) {
    const [ruleId, criterionId] = key.split(':');
    const rule = ruleResults.find((result) => result.rule === ruleId);
    if (!rule) {
      throw new Error(`Finding references an unscored criterion: ${key}`);
    }
    const criterion = rule.criteria.find((result) => result.id === criterionId);
    if (
      criterion?.statusFactor === undefined ||
      criterion.statusFactor === null ||
      applicableWeight === 0
    ) {
      throw new Error(`Finding references an unscored criterion: ${key}`);
    }
    if (criterion.statusFactor === 1) {
      throw new Error(`Finding cannot reference a passing criterion: ${key}`);
    }
    const criterionWeight = rule.weight / rule.applicableCount;
    const lossUnits = roundHalfUp(
      ((100 * criterionWeight * (1 - criterion.statusFactor)) / applicableWeight) * 10_000,
    );
    const baseUnits = Math.floor(lossUnits / criterionFindings.length);
    const remainder = lossUnits % criterionFindings.length;
    criterionFindings.forEach((finding, index) => {
      allocations.set(finding.id, (baseUnits + (index < remainder ? 1 : 0)) / 10_000);
    });
  }
  return deduplicated.map((finding) => ({
    ...finding,
    scoreImpact: allocations.get(finding.id) ?? 0,
  }));
}

/*** Validate the complete finding contract and its evidence references before score allocation. */
function validateFinding(
  finding: Record<string, unknown>,
  evidenceById: Map<string, EvidenceItem>,
): asserts finding is Finding {
  for (const field of [
    'id',
    'rule',
    'criterionId',
    'severity',
    'location',
    'evidence',
    'evidenceLevel',
    'expected',
    'impact',
    'rootCause',
    'fix',
    'verification',
    'confidence',
  ]) {
    const fieldValue = finding[field];
    if (typeof fieldValue !== 'string' || fieldValue === '') {
      throw new Error(`Finding requires a non-empty ${field}.`);
    }
  }
  const findingId = typeof finding.id === 'string' ? finding.id : 'unknown finding';
  if (!Array.isArray(finding.relatedRules)) {
    throw new Error(`Finding ${findingId} requires a relatedRules list.`);
  }
  const evidenceIds = readStringArray(finding.evidenceIds);
  if (evidenceIds.length === 0) {
    throw new Error(`Finding ${findingId} requires evidenceIds.`);
  }
  for (const evidenceId of evidenceIds) {
    if (!evidenceById.has(evidenceId)) {
      throw new Error(`Finding ${findingId} references unknown evidence: ${evidenceId}`);
    }
  }
}

/*** Label rule status from assessed factors while preserving explicit critical evidence. */
function labelRuleStatus(
  criteria: CriterionResult[],
  meanFactor: number | null,
  applicableCount: number,
): string {
  if (applicableCount === 0) return 'not-applicable';
  if (meanFactor === null) return 'not-assessable';
  if (criteria.some((criterion) => criterion.status === 'critical')) return 'critical';
  if (meanFactor === 1) return 'pass';
  if (meanFactor >= 0.75) return 'minor';
  if (meanFactor >= 0.4) return 'major';
  return 'critical';
}

/*** Label evidence coverage without conflating it with confidence. */
function labelCoverage(value: number | null): string | null {
  if (value === null) return null;
  if (value >= 85) return 'high';
  if (value >= 60) return 'medium';
  return 'low';
}

/*** Label aggregate evidence confidence from the canonical numeric thresholds. */
function labelConfidence(value: number | null): string | null {
  if (value === null) return null;
  if (value >= 0.8) return 'high';
  if (value >= 0.5) return 'medium';
  return 'low';
}

/*** Round a nonnegative displayed value half up. */
function roundHalfUp(value: number): number {
  return Math.floor(value + 0.5);
}

/*** Round an intermediate serialization value without changing calculation inputs. */
function roundDecimal(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/*** Return whether a criterion carries the numeric factors required for scoring. */
function isAssessedCriterion(
  criterion: CriterionResult,
): criterion is CriterionResult & { confidenceFactor: number; statusFactor: number } {
  return criterion.statusFactor !== null && criterion.confidenceFactor !== null;
}

/*** Normalize one risk while preserving its supplied descriptive fields. */
function normalizeRisk(value: unknown): Record<string, unknown> {
  assertRecord(value, 'Risk');
  return { ...value, scoreImpact: 0 };
}

/*** Read the only evidence-backed release criterion statuses. */
function readReleaseCriterionStatus(value: unknown): string {
  return value === 'pass' || value === 'fail' ? value : 'not-assessable';
}

/*** Validate the canonical rubric structure loaded from the packaged JSON asset. */
function assertAuditRubric(value: unknown): asserts value is AuditRubric {
  assertRecord(value, 'Audit rubric');
  if (!isNumberRecord(value.confidenceFactors) || !isNullableNumberRecord(value.statusFactors)) {
    throw new Error('Audit rubric factors must be numeric records.');
  }
  if (!Array.isArray(value.rules) || !Array.isArray(value.releaseGates)) {
    throw new Error('Audit rubric requires rules and releaseGates arrays.');
  }
  for (const rule of value.rules) {
    assertRecord(rule, 'Audit rule');
    if (
      typeof rule.id !== 'string' ||
      typeof rule.name !== 'string' ||
      typeof rule.weight !== 'number' ||
      !isStringArray(rule.criteria)
    ) {
      throw new Error('Every audit rule requires id, name, weight, and criteria.');
    }
  }
  for (const gate of value.releaseGates) {
    assertRecord(gate, 'Release gate');
    if (
      typeof gate.id !== 'string' ||
      typeof gate.name !== 'string' ||
      !isStringArray(gate.criteria)
    ) {
      throw new Error('Every release gate requires id, name, and criteria.');
    }
  }
}

/*** Validate one evidence record before semantic checks use its required fields. */
function assertEvidenceItem(value: Record<string, unknown>): asserts value is EvidenceItem {
  const stringFields = [
    'confidence',
    'evidenceLevel',
    'id',
    'kind',
    'location',
    'observation',
    'reproduction',
  ];
  if (
    stringFields.some((field) => typeof value[field] !== 'string') ||
    typeof value.confidenceFactor !== 'number' ||
    !Array.isArray(value.limitations)
  ) {
    throw new Error('Evidence item has an invalid canonical shape.');
  }
}

/*** Return whether every record value is a finite number. */
function isNumberRecord(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((item) => typeof item === 'number');
}

/*** Return whether every record value is numeric or explicitly unassessed. */
function isNullableNumberRecord(value: unknown): value is Record<string, number | null> {
  return (
    isRecord(value) &&
    Object.values(value).every((item) => item === null || typeof item === 'number')
  );
}

/*** Return whether an unknown value contains only strings. */
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/*** Read a stable string list from optional audit input. */
function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

/*** Narrow an unknown value to a non-array record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/*** Require an object-shaped input value. */
function assertRecord(value: unknown, label: string): asserts value is Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${label} must be an object.`);
}

/*** Run catalog inspection or deterministic artifact generation from the command line. */
async function main() {
  const [command, inputPath, outputPath] = process.argv.slice(2);
  if (command === 'catalog') {
    console.log(JSON.stringify(await loadAuditRubric(), null, 2));
    return;
  }
  if (command === 'audit' && inputPath) {
    const input: unknown = JSON.parse(await readFile(inputPath, 'utf8'));
    assertRecord(input, 'Audit artifact input');
    const audit = await calculateAudit(input.auditInput ?? input);
    const artifact = serializeArtifact({ ...input, documentKind: 'audit' }, audit);
    if (outputPath) await writeFile(outputPath, artifact);
    else console.log(artifact);
    return;
  }
  throw new Error('Usage: audit.ts catalog | audit.ts audit <input.json> [output.md]');
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
