import { expect, test } from 'bun:test';

import { dataTableMeta } from './dataTableMeta';

test('describes serializable controlled selection and row activation manifest events', () => {
  expect(JSON.parse(JSON.stringify(dataTableMeta))).toMatchObject({
    bindings: {
      events: {
        rowActivate: { payload: { eventType: 'dataTable.rowActivate' } },
        selectionChange: { payload: { eventType: 'dataTable.selectionChange' } },
      },
      props: { selectedRowIds: { value: { type: 'array' } } },
    },
    events: {
      rowActivate: { payloadFields: [{ path: 'rowId', type: 'string' }] },
      selectionChange: { payloadFields: [{ path: 'selectedRowIds', type: 'unknown' }] },
    },
  });
  expect(dataTableMeta.props.columns.itemSchema?.find(({ key }) => key === 'cell')).toEqual({
    key: 'cell',
    schema: { category: 'Content', label: 'Portable cell presentation', type: 'object' },
  });
});
