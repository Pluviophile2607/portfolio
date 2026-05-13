"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface LoadingContextType {
  showIntro: boolean;
  isLoading: boolean;
  setShowIntro: (val: boolean) => void;
  setIsLoading: (val: boolean) => void;
  hasLoadedGlobal: boolean;
  setHasLoadedGlobal: (val: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Global variable to track if the loader has already run in this session (persists during routing)
let hasLoadedGlobalInit = false;

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(!hasLoadedGlobalInit);
  const [isLoading, setIsLoading] = useState(!hasLoadedGlobalInit);
  const [hasLoadedGlobal, setHasLoadedGlobal] = useState(hasLoadedGlobalInit);

  useEffect(() => {
    if (hasLoadedGlobal) {
      hasLoadedGlobalInit = true;
    }
  }, [hasLoadedGlobal]);

  return (
    <LoadingContext.Provider value={{ 
      showIntro, 
      isLoading, 
      setShowIntro, 
      setIsLoading, 
      hasLoadedGlobal, 
      setHasLoadedGlobal 
    }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
