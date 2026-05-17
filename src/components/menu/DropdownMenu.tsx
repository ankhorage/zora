import React from 'react';

import { Menu } from './Menu';
import type { DropdownMenuProps } from './types';

export function DropdownMenu(props: DropdownMenuProps) {
  return <Menu {...props} />;
}
