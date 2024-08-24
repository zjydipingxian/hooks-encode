import { describe, expect, it } from '@jest/globals';
import { ref } from 'vue';

import useRect from '../index';

describe('useRect', () => {
  it('should return the correct DOMRect for a window', () => {
    const rect = useRect(window);
    expect(rect.width).toEqual(window.innerWidth);
    expect(rect.height).toEqual(window.innerHeight);
  });

  it('should return the correct DOMRect for an element with getBoundingClientRect', () => {
    const element = document.createElement('div');
    const rect = useRect(element);
    expect(rect.width).toEqual(element.getBoundingClientRect().width);
    expect(rect.height).toEqual(element.getBoundingClientRect().height);
  });

  it('should return a default DOMRect for an undefined element', () => {
    const rect = useRect(ref(undefined));
    expect(rect.width).toEqual(0);
    expect(rect.height).toEqual(0);
  });
});
