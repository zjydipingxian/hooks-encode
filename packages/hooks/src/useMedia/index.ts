import { ref, watchEffect } from 'vue';
import useSupported from '../useSupported';

function useMedia(query: string) {
  const isSupported = useSupported(
    () => typeof window !== 'undefined' && 'matchMedia' in window && typeof window.matchMedia === 'function',
  );

  if (!isSupported.value) return;

  let mediaQuery: MediaQueryList | undefined;

  const matches = ref(false);

  const handler = (event: MediaQueryListEvent) => {
    matches.value = event.matches;
  };

  const cleanup = () => {
    if (!mediaQuery) return;
    if ('removeEventListener' in mediaQuery) mediaQuery.removeEventListener('change', handler);
    // @ts-expect-error deprecated API
    else mediaQuery.removeListener(handler);
  };

  watchEffect(() => {
    if (!isSupported.value) return;
    cleanup();

    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia(query);

      if ('addEventListener' in mediaQuery) {
        mediaQuery.addEventListener('change', handler);
      } else {
        // @ts-expect-error deprecated API
        mediaQuery.addListener(handler);
      }
      matches.value = mediaQuery.matches;
    }
  });

  return matches;
}

export default useMedia;
