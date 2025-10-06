"use client";
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Ctx = {
  open: boolean;
  toggle: () => void;
  close: () => void;
  openMenu: () => void;
};

const UserMenuContext = createContext<Ctx | null>(null);

export function UserMenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen(o => !o), []);
  const close = useCallback(() => setOpen(false), []);
  const openMenu = useCallback(() => setOpen(true), []);
  return (
    <UserMenuContext.Provider value={{ open, toggle, close, openMenu }}>
      {children}
    </UserMenuContext.Provider>
  );
}

export function useUserMenu() {
  const ctx = useContext(UserMenuContext);
  if (!ctx) throw new Error('useUserMenu must be used within UserMenuProvider');
  return ctx;
}
