import cytoscape from 'cytoscape';
import ElkLayout from 'cytoscape-elk/src/layout.js';

/*** Register browser-safe layout extensions through Cytoscape's function-style extension API. */
export function registerGraphLayouts() {
  cytoscape('layout', 'elk', ElkLayoutRegistrant);
}

/*** Adapt the native ELK class to the constructor convention required by Cytoscape. */
function ElkLayoutRegistrant(this: Record<string, unknown>, options: Record<string, unknown>) {
  Object.assign(this, new ElkLayout(options));
}

Object.setPrototypeOf(ElkLayoutRegistrant.prototype, ElkLayout.prototype);
