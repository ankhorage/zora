import React from 'react';

import type { GameRuntimeContextValue } from '../../../types/gameRuntime';

/*** Provide the local transient game session and event dispatcher to presentation adapters. */
export const GameRuntimeContext = React.createContext<GameRuntimeContextValue | null>(null);
