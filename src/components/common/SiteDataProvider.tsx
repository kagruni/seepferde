"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/types";

const SiteDataContext = createContext<SiteSettings | null>(null);

export function SiteDataProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const value = useContext(SiteDataContext);
  if (!value) {
    throw new Error("useSiteData must be used within SiteDataProvider");
  }
  return value;
}
