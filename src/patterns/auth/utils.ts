import type { FormFieldConfig, ValidationRule } from '../../components/form';
import type { AuthIdentifierKind } from './types';

export const defaultIdentifiers = ['email'] as const satisfies readonly AuthIdentifierKind[];

function resolveIdentifierKindLabel(identifier: AuthIdentifierKind): string {
  switch (identifier) {
    case 'phone':
      return 'Phone';
    case 'username':
      return 'Username';
    case 'email':
    default:
      return 'Email';
  }
}

function includesIdentifier(
  identifiers: readonly AuthIdentifierKind[],
  identifier: AuthIdentifierKind,
): boolean {
  return identifiers.includes(identifier);
}

export function resolveIdentifierLabel(identifiers: readonly AuthIdentifierKind[]): string {
  if (identifiers.length === 1) {
    return resolveIdentifierKindLabel(identifiers[0] ?? 'email');
  }

  return identifiers.map(resolveIdentifierKindLabel).join(', or ');
}

export function resolveIdentifierType(
  identifiers: readonly AuthIdentifierKind[],
): FormFieldConfig['type'] {
  if (identifiers.length !== 1) {
    return 'text';
  }

  const [identifier] = identifiers;

  if (identifier === 'email') {
    return 'email';
  }

  if (identifier === 'phone') {
    return 'tel';
  }

  return 'text';
}

export function resolveIdentifierRules(
  identifiers: readonly AuthIdentifierKind[],
): readonly ValidationRule[] {
  if (identifiers.length === 1 && identifiers[0] === 'email') {
    return [{ kind: 'required' }, { kind: 'email' }];
  }

  return [{ kind: 'required' }];
}

export function normalizeIdentifierKind(
  identifier: string,
  identifiers: readonly AuthIdentifierKind[],
): AuthIdentifierKind {
  const normalizedIdentifier = identifier.trim();

  if (identifiers.length === 1) {
    return identifiers[0] ?? 'email';
  }

  if (includesIdentifier(identifiers, 'email') && normalizedIdentifier.includes('@')) {
    return 'email';
  }

  if (includesIdentifier(identifiers, 'phone') && /^[+()\d\s.-]+$/.test(normalizedIdentifier)) {
    return 'phone';
  }

  if (includesIdentifier(identifiers, 'username')) {
    return 'username';
  }

  return identifiers[0] ?? 'email';
}
