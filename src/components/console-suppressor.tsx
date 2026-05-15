"use client";

import { useEffect } from 'react';

/**
 * Suppresses specific noisy console warnings from third-party libraries.
 * Currently filtering:
 * - THREE.Clock deprecation warning from @shadergradient/react
 */
export function ConsoleSuppressor() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const originalWarn = console.warn;
    console.warn = (...args) => {
      const msg = args[0];
      if (typeof msg === 'string') {
        if (
          msg.includes('THREE.Clock: This module has been deprecated') ||
          msg.includes('THREE.WebGLProgram') ||
          msg.includes('warning X4000')
        ) {
          return;
        }
      }
      originalWarn.apply(console, args);
    };

    return () => {
      console.warn = originalWarn;
    };
  }, []);

  return null;
}
