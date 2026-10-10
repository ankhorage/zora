import { areCapabilitiesEqual, isCapabilityId } from '@ankhorage/capability';
import type { Capability } from '@ankhorage/contracts/capability';
import type { DataSchema } from '@ankhorage/contracts/data';

import type {
  ZoraComponentEventMeta,
  ZoraComponentEventPayloadFieldMeta,
} from '../../types/authoring';
import { ZORA_COMPONENT_META } from './componentMeta';

/*** Projects direct-manifest ZORA event metadata into unique portable event capabilities. */
export function createEventCapabilities(): readonly Capability[] {
  const capabilitiesById = Object.values(ZORA_COMPONENT_META)
    .filter((component) => component.directManifestNode)
    .flatMap((component) => Object.values(component.events ?? {}))
    .reduce<ReadonlyMap<Capability['id'], Capability>>(
      (capabilities, event) => addEventCapability(capabilities, event),
      new Map(),
    );

  return [...capabilitiesById.values()].sort((left, right) => left.id.localeCompare(right.id));
}

/*** Adds one namespaced metadata event while rejecting conflicting duplicate identities. */
function addEventCapability(
  capabilities: ReadonlyMap<Capability['id'], Capability>,
  event: ZoraComponentEventMeta,
): ReadonlyMap<Capability['id'], Capability> {
  if (!isCapabilityId(event.eventType)) return capabilities;

  const capability = createEventCapability(event);
  const existing = capabilities.get(capability.id);
  if (existing !== undefined && !areCapabilitiesEqual(existing, capability)) {
    throw new Error(`ZORA event metadata defines conflicting capability "${capability.id}".`);
  }

  return new Map([...capabilities, [capability.id, capability]]);
}

/*** Converts one emitted component event into its serializable canonical descriptor. */
function createEventCapability(event: ZoraComponentEventMeta): Capability {
  if (!isCapabilityId(event.eventType)) {
    throw new Error(
      `ZORA event metadata must use a namespaced capability id: "${event.eventType}".`,
    );
  }

  return {
    id: event.eventType,
    owner: '@ankhorage/zora',
    access: ['emit'],
    binding: { kind: 'event', bindableAs: ['source'] },
    label: event.label,
    ...(event.description === undefined ? {} : { description: event.description }),
    output: { schema: createEventPayloadSchema(event.payloadFields ?? []) },
  };
}

/*** Projects the documented event payload fields into an open object schema. */
function createEventPayloadSchema(
  fields: readonly ZoraComponentEventPayloadFieldMeta[],
): DataSchema {
  return {
    type: 'object',
    properties: fields.reduce<Readonly<Record<string, DataSchema>>>(addPayloadField, {}),
  };
}

/*** Adds one dotted metadata path to an immutable object-schema property map. */
function addPayloadField(
  properties: Readonly<Record<string, DataSchema>>,
  field: ZoraComponentEventPayloadFieldMeta,
): Readonly<Record<string, DataSchema>> {
  return addPayloadFieldAtPath(properties, field.path.split('.'), createPayloadFieldSchema(field));
}

/*** Recursively embeds a leaf schema below its documented object-property path. */
function addPayloadFieldAtPath(
  properties: Readonly<Record<string, DataSchema>>,
  path: readonly string[],
  schema: DataSchema,
): Readonly<Record<string, DataSchema>> {
  const [key, ...remainingPath] = path;
  if (key === undefined || key === '') return properties;
  if (remainingPath.length === 0) return { ...properties, [key]: schema };

  const current = Object.entries(properties).find(([propertyKey]) => propertyKey === key)?.[1];
  const nestedProperties = addPayloadFieldAtPath(current?.properties ?? {}, remainingPath, schema);
  return {
    ...properties,
    [key]: { ...current, type: 'object', properties: nestedProperties },
  };
}

/*** Maps one authoring payload-field type and annotations to its portable data schema. */
function createPayloadFieldSchema(field: ZoraComponentEventPayloadFieldMeta): DataSchema {
  return {
    ...(field.type === 'object'
      ? { type: 'object' as const }
      : field.type === 'record'
        ? { type: 'object' as const, additionalProperties: true }
        : field.type === 'unknown'
          ? {}
          : { type: field.type }),
    ...(field.label === undefined ? {} : { title: field.label }),
    ...(field.description === undefined ? {} : { description: field.description }),
  };
}
