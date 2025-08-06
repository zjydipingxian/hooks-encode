import { describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';
import useHover from '..';

describe('useHover', () => {
  it('应该被定义', () => {
    expect(useHover).toBeDefined();
  });

  it('应该返回初始值为 false 的 ref', () => {
    const target = ref(document.createElement('div'));
    const isHovering = useHover(target);

    expect(isHovering.value).toBe(false);
  });
});
