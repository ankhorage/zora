import type { UiComponentBindingMeta } from '@ankhorage/contracts';

import type { ZoraComponentMeta } from '../metadata/types';

/*** Derives scalar bindings and normalized events from explicit component authoring schemas. */
export function createManifestBindings(
  props: ZoraComponentMeta['props'],
  events: ZoraComponentMeta['events'] = {},
): UiComponentBindingMeta {
  return {
    props: Object.fromEntries(
      Object.entries(props)
        .filter(([, schema]) => schema.type !== 'action')
        .map(([key, schema]) => [
          key,
          {
            label: schema.label ?? key,
            acceptsFallback: true,
            acceptsTransforms: true,
            value: {
              type:
                schema.type === 'boolean' || schema.type === 'number' || schema.type === 'array'
                  ? schema.type
                  : schema.type === 'media' || schema.type === 'imageAsset'
                    ? 'imageAsset'
                    : schema.type === 'spacing' || schema.type === 'radius'
                      ? 'unknown'
                      : schema.type === 'enum' &&
                          schema.enum?.length &&
                          schema.enum.every((value) => typeof value === 'number')
                        ? 'number'
                        : 'string',
            },
          },
        ]),
    ),
    events: Object.fromEntries(
      Object.entries(events).map(([key, event]) => [
        key,
        {
          label: event.label,
          payload: { eventType: event.eventType, fields: event.payloadFields ?? [] },
        },
      ]),
    ),
  };
}
