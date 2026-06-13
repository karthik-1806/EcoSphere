import "@testing-library/jest-dom";
import { expect, vi } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";
import type { AxeMatchers } from "vitest-axe/matchers";

/* eslint-disable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
declare module "vitest" {
  export interface Assertion<T = any> extends AxeMatchers {}
  export interface AsymmetricMatchersContaining extends AxeMatchers {}
}
/* eslint-enable @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

// Extend Vitest expectations with vitest-axe matchers
expect.extend(axeMatchers);

// Mock browser requestIdleCallback and cancelIdleCallback
if (typeof window !== "undefined") {
  // Override Node.js v25+ native experimental localStorage stub with a functional mock
  if (!window.localStorage || typeof window.localStorage.clear !== "function") {
    const storageStore: Record<string, string> = {};
    const mockLocalStorage = {
      getItem: (key: string) => storageStore[key] ?? null,
      setItem: (key: string, value: string) => {
        storageStore[key] = value;
      },
      removeItem: (key: string) => {
        delete storageStore[key];
      },
      clear: () => {
        for (const k of Object.keys(storageStore)) {
          delete storageStore[k];
        }
      },
      length: 0,
      key: (index: number) => Object.keys(storageStore)[index] ?? null
    };
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });
    Object.defineProperty(globalThis, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true
    });
  }

  window.requestIdleCallback = vi.fn().mockImplementation((cb: IdleRequestCallback) => {
    cb({
      didTimeout: false,
      timeRemaining: () => 10
    });
    return 0;
  });

  window.cancelIdleCallback = vi.fn().mockImplementation((id: number) => {
    void id;
  });

  const originalGetComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = ((elt: Element, pseudoElt?: string | null) => {
    if (pseudoElt) {
      return originalGetComputedStyle(elt);
    }
    return originalGetComputedStyle(elt);
  }) as typeof window.getComputedStyle;

  HTMLCanvasElement.prototype.getContext = vi.fn().mockImplementation(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn().mockReturnValue({ data: new Uint8ClampedArray(4) }),
    putImageData: vi.fn(),
    createImageData: vi.fn(),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    measureText: vi.fn().mockReturnValue({ width: 0 }),
    transform: vi.fn(),
    rect: vi.fn(),
    clip: vi.fn()
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
