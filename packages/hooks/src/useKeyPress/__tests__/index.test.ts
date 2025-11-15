/**
 * @file useKeyPress 组合函数的单元测试
 * @description 测试键盘按键监听 hook 的各种使用场景和边界情况
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { nextTick } from 'vue';
import useKeyPress from '..';

describe('useKeyPress', () => {
  beforeEach(() => {
    // 清理环境
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * 测试用例1: 基本功能验证
   */
  it('应该正确导出', () => {
    expect(useKeyPress).toBeDefined();
    expect(typeof useKeyPress).toBe('function');
  });

  /**
   * 测试用例2: 单键监听
   */
  it('应该能监听单个按键', async () => {
    const callback = vi.fn();
    const pressed = useKeyPress('Enter', callback);

    expect(pressed.value).toBe(false);

    // 模拟按下 Enter 键
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);
    await nextTick();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(pressed.value).toBe(true);

    // 模拟释放按键
    const upEvent = new KeyboardEvent('keyup', { key: 'Enter' });
    window.dispatchEvent(upEvent);
    await nextTick();

    expect(pressed.value).toBe(false);
  });

  /**
   * 测试用例3: 组合键监听
   */
  it('应该能监听组合键', async () => {
    const callback = vi.fn();
    useKeyPress(['ctrl', 's'], callback);

    // 模拟按下 Ctrl + S
    const event = new KeyboardEvent('keydown', {
      key: 's',
      ctrlKey: true,
    });
    window.dispatchEvent(event);
    await nextTick();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  /**
   * 测试用例4: 别名支持
   */
  it('应该支持按键别名', async () => {
    const escCallback = vi.fn();
    const spaceCallback = vi.fn();

    useKeyPress('esc', escCallback);
    useKeyPress('space', spaceCallback);

    // 测试 esc 别名
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();
    expect(escCallback).toHaveBeenCalled();

    // 测试 space 别名
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await nextTick();
    expect(spaceCallback).toHaveBeenCalled();
  });

  /**
   * 测试用例5: 自定义过滤器
   */
  it('应该支持自定义过滤器函数', async () => {
    const callback = vi.fn();

    // 只监听数字键
    useKeyPress((event) => /^[0-9]$/.test(event.key), callback);

    // 按下数字键
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '5' }));
    await nextTick();
    expect(callback).toHaveBeenCalledTimes(1);

    // 按下字母键（不应触发）
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    await nextTick();
    expect(callback).toHaveBeenCalledTimes(1); // 仍然是 1 次
  });

  /**
   * 测试用例6: 修饰键检测
   */
  it('应该能正确检测修饰键', async () => {
    const ctrlCallback = vi.fn();
    const shiftCallback = vi.fn();
    const altCallback = vi.fn();

    useKeyPress(['ctrl', 'a'], ctrlCallback);
    useKeyPress(['shift', 'b'], shiftCallback);
    useKeyPress(['alt', 'c'], altCallback);

    // Ctrl + A
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', ctrlKey: true }));
    await nextTick();
    expect(ctrlCallback).toHaveBeenCalled();

    // Shift + B
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b', shiftKey: true }));
    await nextTick();
    expect(shiftCallback).toHaveBeenCalled();

    // Alt + C
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c', altKey: true }));
    await nextTick();
    expect(altCallback).toHaveBeenCalled();
  });

  /**
   * 测试用例7: 事件类型选择
   */
  it('应该支持 keyup 事件', async () => {
    const callback = vi.fn();
    useKeyPress('a', callback, { events: 'keyup' });

    // keydown 不应触发
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    await nextTick();
    expect(callback).not.toHaveBeenCalled();

    // keyup 应该触发
    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    await nextTick();
    expect(callback).toHaveBeenCalled();
  });

  /**
   * 测试用例8: 不匹配的按键不应触发
   */
  it('不匹配的按键不应触发回调', async () => {
    const callback = vi.fn();
    useKeyPress('Enter', callback);

    // 按下其他键
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    await nextTick();

    expect(callback).not.toHaveBeenCalled();
  });

  /**
   * 测试用例9: 返回值响应式状态
   */
  it('返回的 pressed 状态应该是响应式的', async () => {
    const pressed = useKeyPress('Space');

    expect(pressed.value).toBe(false);

    // 按下
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    await nextTick();
    expect(pressed.value).toBe(true);

    // 释放
    window.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
    await nextTick();
    expect(pressed.value).toBe(false);
  });

  /**
   * 测试用例10: Mac 的 Meta 键应该等同于 Ctrl
   */
  it('Meta 键应该被识别为 Ctrl', async () => {
    const callback = vi.fn();
    useKeyPress(['ctrl', 's'], callback);

    // 使用 Meta 键（Mac 的 Cmd）
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', metaKey: true }));
    await nextTick();

    expect(callback).toHaveBeenCalled();
  });
});
