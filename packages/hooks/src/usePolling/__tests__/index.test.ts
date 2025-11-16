/**
 * @file usePolling 组合函数的单元测试
 * @description 测试轮询 hook 的各种使用场景
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import usePolling from '..';

describe('usePolling', () => {
  // Mock timers
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * 测试用例1: 基本功能验证
   */
  it('应该正确导出', () => {
    expect(usePolling).toBeDefined();
    expect(typeof usePolling).toBe('function');
  });

  /**
   * 测试用例2: 默认值
   */
  it('应该使用默认值', () => {
    const fn = vi.fn().mockResolvedValue('test');
    const { data, loading, error, retryCount } = usePolling(fn);

    expect(data.value).toBeNull();
    expect(loading.value).toBe(false);
    expect(error.value).toBeNull();
    expect(retryCount.value).toBe(0);
  });

  /**
   * 测试用例3: 立即执行
   */
  it('应该支持立即执行', async () => {
    const fn = vi.fn().mockResolvedValue('test result');
    const { data, loading } = usePolling(fn, { immediate: true });

    // 立即执行应该是同步的
    expect(loading.value).toBe(true);

    // 等待异步执行完成
    await nextTick();
    vi.advanceTimersByTime(0);

    expect(fn).toHaveBeenCalled();
    expect(data.value).toBe('test result');
    expect(loading.value).toBe(false);
  });

  /**
   * 测试用例4: 定时轮询
   */
  it('应该按间隔定时执行', async () => {
    const fn = vi.fn().mockResolvedValue('test');
    const interval = 1000;

    usePolling(fn, { interval, immediate: false });

    // 初始不应该调用
    expect(fn).not.toHaveBeenCalled();

    // 等待一个间隔
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).toHaveBeenCalledTimes(1);

    // 等待第二个间隔
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  /**
   * 测试用例5: 手动执行
   */
  it('应该支持手动执行', async () => {
    const fn = vi.fn().mockResolvedValue('manual result');
    const { data, loading, run } = usePolling(fn, { immediate: false });

    expect(fn).not.toHaveBeenCalled();

    // 手动执行
    const runPromise = run();
    expect(loading.value).toBe(true);

    await runPromise;
    expect(fn).toHaveBeenCalled();
    expect(data.value).toBe('manual result');
    expect(loading.value).toBe(false);
  });

  /**
   * 测试用例6: 暂停和恢复
   */
  it('应该支持暂停和恢复', async () => {
    const fn = vi.fn().mockResolvedValue('test');
    const interval = 1000;
    const { pause, resume } = usePolling(fn, { interval, immediate: false });

    // 暂停后不应该执行
    pause();
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).not.toHaveBeenCalled();

    // 恢复后应该执行
    resume();
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).toHaveBeenCalled();
  });

  /**
   * 测试用例7: 停止轮询
   */
  it('应该支持停止轮询', async () => {
    const fn = vi.fn().mockResolvedValue('test');
    const interval = 1000;
    const { stop } = usePolling(fn, { interval, immediate: false });

    // 停止后不应该再执行
    stop();
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).not.toHaveBeenCalled();

    // 即使等待多个间隔也不应该执行
    vi.advanceTimersByTime(interval * 3);
    await nextTick();
    expect(fn).not.toHaveBeenCalled();
  });

  /**
   * 测试用例8: 重启轮询
   */
  it('应该支持重启轮询', async () => {
    const fn = vi.fn().mockResolvedValue('test');
    const interval = 1000;
    const { restart } = usePolling(fn, { interval, immediate: false });

    // 重启后应该开始执行
    restart();
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).toHaveBeenCalled();
  });

  /**
   * 测试用例9: 错误处理
   */
  it('应该正确处理错误', async () => {
    const error = new Error('Test error');
    const fn = vi.fn().mockRejectedValue(error);
    const { error: errorRef, retryCount } = usePolling(fn, { immediate: true });

    await nextTick();
    vi.advanceTimersByTime(0);

    expect(errorRef.value).toBe(error);
    expect(retryCount.value).toBe(1);
  });

  /**
   * 测试用例10: 条件轮询
   */
  it('应该支持条件轮询', async () => {
    let shouldPoll = true;
    const fn = vi.fn().mockResolvedValue('test');
    const interval = 1000;

    usePolling(fn, {
      interval,
      immediate: false,
      condition: () => shouldPoll,
    });

    // 条件满足时应该执行
    shouldPoll = true;
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).toHaveBeenCalled();

    // 重置调用计数
    fn.mockClear();

    // 条件不满足时不应该执行
    shouldPoll = false;
    vi.advanceTimersByTime(interval);
    await nextTick();
    expect(fn).not.toHaveBeenCalled();
  });

  /**
   * 测试用例11: 重试机制
   */
  it('应该支持重试机制', async () => {
    const error = new Error('Test error');
    const fn = vi
      .fn()
      .mockRejectedValueOnce(error) // 第一次失败
      .mockResolvedValueOnce('success'); // 第二次成功

    const {
      data,
      error: errorRef,
      retryCount,
    } = usePolling(fn, {
      immediate: true,
      retry: {
        maxAttempts: 3,
        baseDelay: 100,
      },
    });

    // 第一次执行失败
    await nextTick();
    vi.advanceTimersByTime(0);
    expect(errorRef.value).toBe(error);
    expect(retryCount.value).toBe(1);

    // 等待重试延迟后第二次执行成功
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(data.value).toBe('success');
    expect(errorRef.value).toBeNull();
    expect(retryCount.value).toBe(0);
  });

  /**
   * 测试用例12: 最大重试次数
   */
  it('应该在达到最大重试次数后停止', async () => {
    const error = new Error('Persistent error');
    const fn = vi.fn().mockRejectedValue(error);
    const maxAttempts = 2;

    const { error: errorRef, retryCount } = usePolling(fn, {
      immediate: true,
      retry: { maxAttempts, baseDelay: 100 },
    });

    // 第一次失败
    await nextTick();
    vi.advanceTimersByTime(0);
    expect(retryCount.value).toBe(1);

    // 第二次失败，达到最大重试次数
    vi.advanceTimersByTime(100);
    await nextTick();
    expect(retryCount.value).toBe(2);
    expect(errorRef.value).toBe(error);

    // 不应该再重试
    vi.advanceTimersByTime(1000);
    await nextTick();
    expect(retryCount.value).toBe(2); // 保持不变
  });
});
