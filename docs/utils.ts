import { nextTick, onMounted, onActivated } from 'vue';

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

export function onMountedOrActivated(hook: () => any) {
  let mounted: boolean;

  onMounted(() => {
    hook();
    nextTick(() => {
      mounted = true;
    });
  });

  onActivated(() => {
    if (mounted) {
      hook();
    }
  });
}
