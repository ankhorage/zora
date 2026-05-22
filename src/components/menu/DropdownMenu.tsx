import React from 'react';

import { Menu } from './Menu';
import type { DropdownMenuProps } from './types';

/***
 * Convenience wrapper for rendering a `Menu` as a dropdown.
 *
 * @readme
 */
export function DropdownMenu(props: DropdownMenuProps) {
  return <Menu {...props} />;
}
