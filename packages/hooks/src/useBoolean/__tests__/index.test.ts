import { describe, expect, it } from '@jest/globals';

import useBoolean from '..';

describe('useBoolean', () => {
  it('should be defined', () => {
    expect(useBoolean).toBeDefined();
  });

  it('默认值是 false', async () => {
    const [state] = useBoolean();
    expect(state.value).toBeFalsy();
  });

  it('可以设置默认值', async () => {
    const [state] = useBoolean(true);
    expect(state.value).toBeTruthy();
  });

  it('should work', async () => {
    const [state, { toggle, setTrue, setFalse }] = useBoolean(true);

    expect(state.value).toBeTruthy();

    toggle();
    expect(state.value).toBeFalsy();

    setTrue();
    expect(state.value).toBeTruthy();

    setFalse();
    expect(state.value).toBeFalsy();
  });
});
