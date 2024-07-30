export const inBrowser = typeof window !== 'undefined';

export const supportsPassive = true;

export function raf(fn: FrameRequestCallback): number {
  return inBrowser ? requestAnimationFrame(fn) : -1;
}

export function cancelRaf(id: number) {
  if (inBrowser) {
    cancelAnimationFrame(id);
  }
}

export function doubleRaf(fn: FrameRequestCallback): void {
  raf(() => raf(fn));
}
