"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type LightboxImage = { src: string; alt: string };

type LightboxState = {
  images: LightboxImage[];
  index: number;
} | null;

type LightboxContextValue = {
  state: LightboxState;
  openLightbox: (images: LightboxImage[], index: number) => void;
  closeLightbox: () => void;
  next: () => void;
  prev: () => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LightboxState>(null);

  const openLightbox = useCallback((images: LightboxImage[], index: number) => {
    setState({ images, index });
  }, []);

  const closeLightbox = useCallback(() => setState(null), []);

  const next = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s));
  }, []);

  const prev = useCallback(() => {
    setState((s) =>
      s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s
    );
  }, []);

  const value = useMemo(
    () => ({ state, openLightbox, closeLightbox, next, prev }),
    [state, openLightbox, closeLightbox, next, prev]
  );

  return (
    <LightboxContext.Provider value={value}>{children}</LightboxContext.Provider>
  );
}

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) {
    throw new Error("useLightbox must be used within a LightboxProvider");
  }
  return ctx;
}
