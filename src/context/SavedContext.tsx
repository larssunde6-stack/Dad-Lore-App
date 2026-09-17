import React, { createContext, useContext, useMemo, useState } from 'react';

type SavedContextValue = {
  savedIds: Set<string>;
  toggleSaved: (id: string) => void;
};

const SavedContext = createContext<SavedContextValue | undefined>(undefined);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set(['2', '6']));

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const value = useMemo(() => ({ savedIds, toggleSaved }), [savedIds]);

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) {
    throw new Error('useSaved must be used within a SavedProvider');
  }
  return ctx;
}
