import { describe, expect, it } from 'vitest';
import useLockFn from '..';

describe('useLockFn', () => {
  it('防止并发调用', async () => {
    let count = 0;
    const fn = async () => {
      count++;
      await new Promise((resolve) => setTimeout(resolve, 50));
    };

    const lockedFn = useLockFn(fn);
    await Promise.all([lockedFn(), lockedFn(), lockedFn(), lockedFn()]);

    expect(count).toBe(1);
  });

  it('按顺序执行', async () => {
    const arr: number[] = [];
    const fn = async (val: number) => {
      arr.push(val);
      await new Promise((resolve) => setTimeout(resolve, 50));
    };

    const lockedFn = useLockFn(fn);
    await Promise.all([lockedFn(1), lockedFn(2), lockedFn(3)]);

    expect(arr).toEqual([1]);
  });

  it('错误处理', async () => {
    const errorFn = async () => {
      throw new Error('test error');
    };

    const lockedFn = useLockFn(errorFn);
    try {
      await lockedFn();
    } catch (error) {
      expect(error.message).toBe('test error');
    }
  });

  it('返回值正确', async () => {
    const fn = async () => {
      return 1;
    };

    const lockedFn = useLockFn(fn);
    const result = await lockedFn();
    expect(result).toBe(1);
  });
});
