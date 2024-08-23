import { describe, expect, it } from '@jest/globals';

import useToggle from '../index';
import { ref } from 'vue';
describe('useToggle', () => {
  it('should toggle between values', () => {
    const [state, actions] = useToggle('first', 'second', 'third');

    expect(state.value).toBe('first');
    actions[0](); // toggle
    expect(state.value).toBe('second');
    actions[0](); // toggle again
    expect(state.value).toBe('third');
    actions[0](); // toggle again
    expect(state.value).toBe('first'); // should reset to initial value after toggling through all
  });

  it('should change state when a specific value is passed to toggle', () => {
    const [state, actions] = useToggle('first', 'second', 'third');

    actions[0]('second'); // pass 'second' to toggle
    expect(state.value).toBe('second');
  });

  it('should create correct number of handle functions', () => {
    const [state, actions] = useToggle('first', 'second', 'third');

    expect(actions).toHaveLength(4); // 1 toggle function + 3 handle functions
  });

  it('handle functions should correctly set the state', () => {
    const [state, actions] = useToggle('first', 'second', 'third');

    actions[1]();
    expect(state.value).toBe('first');
    actions[2]();
    expect(state.value).toBe('second');
  });

  it('should work with refs as well as direct values', () => {
    const firstRef = ref('first');
    const secondRef = ref('second');
    const [state, actions] = useToggle(firstRef, secondRef);

    expect(state.value).toBe('first');
    actions[0](); // toggle
    expect(state.value).toBe('second');
    actions[0](); // toggle again
    expect(state.value).toBe('first');
  });
});
