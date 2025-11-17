/**
 * @file useRequest 组合函数的单元测试
 * @description 测试请求 hook 的各种使用场景
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import useRequest from '..';

describe('useRequest', () => {
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
    expect(useRequest).toBeDefined();
    expect(typeof useRequest).toBe('function');
  });

  /**
   * 测试用例3: 手动执行
   */
  it('应该支持手动执行', async () => {
    const service = vi.fn().mockResolvedValue('manual data');
    const { data, loading, run } = useRequest(service, { manual: true });

    expect(service).not.toHaveBeenCalled();
    expect(data.value).toBeUndefined();
    expect(loading.value).toBe(false);

    // 手动执行
    const runPromise = run();
    expect(loading.value).toBe(true);

    await runPromise;
    expect(service).toHaveBeenCalled();
    expect(data.value).toBe('manual data');
    expect(loading.value).toBe(false);
  });

  /**
   * 测试用例6: 轮询功能
   */
  it('应该支持轮询功能', async () => {
    const service = vi.fn().mockResolvedValue('polling data');
    const pollingInterval = 1000;

    const { run } = useRequest(service, { pollingInterval, manual: true });

    expect(service).not.toHaveBeenCalled();

    // 手动执行一次
    await run();

    // 等待一个轮询周期
    vi.advanceTimersByTime(pollingInterval);
    await nextTick();
    expect(service).toHaveBeenCalledTimes(2); // 初始执行 + 轮询执行

    // 等待第二个轮询周期
    vi.advanceTimersByTime(pollingInterval);
    await nextTick();
    expect(service).toHaveBeenCalledTimes(3);
  });

  /**
   * 测试用例7: 数据修改
   */
  it('应该支持数据修改', async () => {
    const service = vi.fn().mockResolvedValue({ name: 'initial' });
    const { data, mutate } = useRequest(service);

    // 等待初始请求完成
    await nextTick();
    vi.advanceTimersByTime(0);

    // 直接修改数据
    mutate({ name: 'updated' });
    expect(data.value).toEqual({ name: 'updated' });

    // 通过函数修改数据
    mutate((oldData) => ({ ...oldData, age: 25 }));
    expect(data.value).toEqual({ name: 'updated', age: 25 });
  });

  /**
   * 测试用例8: 取消请求
   */
  it('应该支持取消请求', async () => {
    const service = vi.fn().mockResolvedValue('test data');
    const { loading, run, cancel } = useRequest(service, { manual: true });

    // 执行请求
    const runPromise = run();
    expect(loading.value).toBe(true);

    // 取消请求
    cancel();
    await runPromise;

    // 状态应该正确更新
    expect(loading.value).toBe(false);
  });

  /**
   * 测试用例9: 刷新请求
   */
  it('应该支持刷新请求', async () => {
    const service = vi.fn().mockResolvedValue('refresh data');
    const { data, refresh } = useRequest(service, { manual: true });

    expect(service).not.toHaveBeenCalled();

    // 刷新请求
    await refresh();
    expect(service).toHaveBeenCalled();
    expect(data.value).toBe('refresh data');
  });

  /**
   * 测试用例10: 初始化数据
   */
  it('应该支持初始化数据', () => {
    const initialData = { name: 'initial', id: 1 };
    const { data } = useRequest(vi.fn(), { initialData });

    expect(data.value).toEqual(initialData);
  });

  /**
   * 测试用例: 执行前回调
   */
  it('应该支持执行前回调', async () => {
    const onBefore = vi.fn();
    const service = vi.fn().mockResolvedValue('test');

    const { run } = useRequest(service, { onBefore, manual: true });

    const params = ['param1', 'param2'];
    await run(...params);

    expect(onBefore).toHaveBeenCalledWith(...params);
    expect(service).toHaveBeenCalledWith(...params);
  });
});
