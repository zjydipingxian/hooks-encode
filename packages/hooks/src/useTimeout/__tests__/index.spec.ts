import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';
import useTimeout from '../index';

describe('useTimeout', () => {
  let fn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // 重置所有 mocks
    vi.useFakeTimers();

    fn = vi.fn();
  });

  afterEach(() => {
    // 恢复所有计时器
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  /**
   * Test Case 1: 基础功能测试 - 正常延迟执行
   * 验证当提供有效的 delay 时，函数会在指定时间后执行
   */
  it('基础功能测试 - 正常延迟执行', () => {
    useTimeout(fn, 1000);

    // 验证函数尚未被执行
    expect(fn).not.toHaveBeenCalled();

    // 快进时间
    vi.advanceTimersByTime(1000);

    // 验证函数已被执行
    expect(fn).toHaveBeenCalledTimes(1);
  });

  /**
   * Test Case 2: Ref 类型 delay 测试
   * 验证当 delay 是 Ref 对象时，能够正确处理
   */
  it('Ref 类型 delay 测试', () => {
    const delayRef = ref(500);
    useTimeout(fn, delayRef);

    // 验证函数尚未被执行
    expect(fn).not.toHaveBeenCalled();

    // 快进时间
    vi.advanceTimersByTime(500);

    // 验证函数已被执行
    expect(fn).toHaveBeenCalledTimes(1);
  });

  /**
   * Test Case 3: 立即执行选项测试
   * 验证当 immediate 为 true 时，函数立即执行
   */
  it('立即执行选项测试', () => {
    useTimeout(fn, 1000, { immediate: true });

    // 验证函数已被立即执行
    expect(fn).toHaveBeenCalledTimes(1);

    // 验证函数立即被执行一次
    expect(fn).toHaveBeenCalledTimes(1);

    // 快进时间
    vi.advanceTimersByTime(1000);

    // 验证函数总共被执行两次
    expect(fn).toHaveBeenCalledTimes(2);
  });

  /**
   * Test Case 4: 立即执行选项为 false 或未设置
   * 验证默认情况下不立即执行
   */
  it('验证默认情况下不立即执行', () => {
    useTimeout(fn, 1000, { immediate: false });
    expect(fn).not.toHaveBeenCalled();

    useTimeout(fn, 1000); // 不设置 options
    expect(fn).not.toHaveBeenCalled();
  });

  /**
   * Test Case 5: delay 为 undefined 的情况
   * 验证当 delay 为 undefined 时不执行任何操作
   */

  it('验证当 delay 为 undefined 时不执行任何操作', () => {
    const delayRef = ref<number | undefined>(undefined);
    useTimeout(fn, delayRef);

    // 快进大量时间
    vi.advanceTimersByTime(10000);

    // 验证函数从未被执行
    expect(fn).not.toHaveBeenCalled();
  });
});
