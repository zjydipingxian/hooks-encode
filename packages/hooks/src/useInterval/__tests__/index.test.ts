/**
 * @file useInterval 组合函数的单元测试
 * @description 测试定时器hook的各种使用场景和边界情况
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useInterval from '..';

describe('useInterval', () => {
  let mockFn: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockFn = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  /**
   * 测试用例1: 正常定时器功能
   * 验证当提供有效delay时，函数会定期执行
   */
  it('验证当提供有效delay时，函数会定期执行', () => {
    useInterval(mockFn, 1000);

    // 快进1秒，应该调用一次
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 再快进2秒，应该总共调用3次
    vi.advanceTimersByTime(2000);
    expect(mockFn).toHaveBeenCalledTimes(3);
  });

  /**
   * 测试用例2: 立即执行选项
   * 验证immediate=true时函数立即执行
   */
  it('验证immediate=true时函数立即执行', () => {
    useInterval(mockFn, 1000, { immediate: true });

    // 应该立即调用一次
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 快进1秒，应该再调用一次
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  /**
   * 测试用例3: 不立即执行
   * 验证immediate=false或未设置时不立即执行
   */
  it('验证immediate=false或未设置时不立即执行', () => {
    useInterval(mockFn, 1000, { immediate: false });
    expect(mockFn).toHaveBeenCalledTimes(0);

    useInterval(mockFn, 1000); // 不设置immediate
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  /**
   * 测试用例4: 无效delay处理
   * 验证当delay为无效值时的行为
   */
  it('验证当delay为无效值时的行为', () => {
    // delay为undefined
    useInterval(mockFn, undefined);
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(0);

    // delay为负数
    useInterval(mockFn, -100);
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(0);

    // delay为非数字
    useInterval(mockFn, 'invalid' as unknown as number);
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  /**
   * 测试用例5: 定时器清理功能
   * 验证clear方法能正确停止定时器
   */
  it('验证clear方法能正确停止定时器', () => {
    const { clear } = useInterval(mockFn, 1000);

    // 快进1秒，应该调用一次
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 清除定时器
    clear();

    // 再快进2秒，不应该有更多调用
    vi.advanceTimersByTime(2000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例6: 定时器重启功能
   * 验证restart方法能正确重启定时器
   */
  it('验证restart方法能正确重启定时器', () => {
    const { restart } = useInterval(mockFn, 1000);

    // 初始状态不执行
    expect(mockFn).toHaveBeenCalledTimes(0);

    // 快进1秒，仍不应执行（因为没有immediate）
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);

    // 重启定时器
    restart();

    // 快进1秒，应该执行一次
    vi.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});
