import { describe, expect, it } from '@jest/globals';
import useTitle from '../index';
import { ref } from 'vue';
import renderHook from '../../../test-utils/renderHook';

describe('useTitle', () => {
  it('should update document title', () => {
    const titleRef = ref('Current Page Title');
    renderHook(() => useTitle(titleRef));

    expect(document.title).toBe('Current Page Title');
    titleRef.value = 'Other Page Title';
    renderHook(() => useTitle(titleRef));
    expect(document.title).toBe('Other Page Title');
  });

  it('should restore document title on unmount', () => {
    document.title = 'Old Title';
    const titleRef = ref('Current Page Title');
    const { wrapper } = renderHook(() => useTitle(titleRef, { restoreOnUnmount: true }));

    expect(document.title).toBe('Current Page Title');
    wrapper.unmount();
    expect(document.title).toBe('Old Title');
  });

  it('should not restore document title on unmount', () => {
    document.title = 'Old Title';

    const titleRef = ref('Current Page Title');
    const { wrapper } = renderHook(() =>
      useTitle(titleRef, {
        restoreOnUnmount: false,
      }),
    );
    expect(document.title).toBe('Current Page Title');

    wrapper.unmount();
    expect(document.title).toBe('Current Page Title');
  });
});
