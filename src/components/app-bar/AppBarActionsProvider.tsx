import React from 'react';

export interface AppBarActionsProviderProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

const AppBarActionsContext = React.createContext<React.ReactNode>(null);

export function AppBarActionsProvider({
  actions,
  children,
}: AppBarActionsProviderProps) {
  return (
    <AppBarActionsContext.Provider value={actions ?? null}>
      {children}
    </AppBarActionsContext.Provider>
  );
}

export function useAppBarActions() {
  return React.useContext(AppBarActionsContext);
}
