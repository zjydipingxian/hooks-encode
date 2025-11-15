/**
 * @file useInViewport 组合函数的单元测试
 * @description 测试视口检测 hook 的各种使用场景
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, nextTick } from 'vue';
import useInViewport from '..';

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element>;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    this.elements = new Set();
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  // 模拟触发回调
  trigger(isIntersecting: boolean, intersectionRatio: number = 1) {
    const entries = Array.from(this.elements).map((target) => ({
      target,
      isIntersecting,
      intersectionRatio,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.callback(entries as IntersectionObserverEntry[], this as any);
  }
}

describe('useInViewport', () => {
  let observerInstance: MockIntersectionObserver | null = null;

  beforeEach(() => {
    // Mock IntersectionObserver

    global.IntersectionObserver = vi.fn((callback) => {
      observerInstance = new MockIntersectionObserver(callback);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return observerInstance as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  });

  afterEach(() => {
    observerInstance = null;
    vi.clearAllMocks();
  });

  /**
   * 测试用例1: 基本功能验证
   */
  it('应该正确导出', () => {
    expect(useInViewport).toBeDefined();
    expect(typeof useInViewport).toBe('function');
  });

  /**
   * 测试用例2: 初始状态
   */
  it('应该返回正确的初始状态', () => {
    const div = document.createElement('div');
    const { inViewport, ratio } = useInViewport(div);

    expect(inViewport.value).toBe(false);
    expect(ratio.value).toBe(0);
  });

  /**
   * 测试用例3: 元素进入视口
   */
  it('元素进入视口时应该更新状态', async () => {
    const div = document.createElement('div');
    const { inViewport, ratio } = useInViewport(div);

    expect(inViewport.value).toBe(false);

    // 模拟元素进入视口
    observerInstance?.trigger(true, 1);
    await nextTick();

    expect(inViewport.value).toBe(true);
    expect(ratio.value).toBe(1);
  });

  /**
   * 测试用例4: 元素离开视口
   */
  it('元素离开视口时应该更新状态', async () => {
    const div = document.createElement('div');
    const { inViewport, ratio } = useInViewport(div);

    // 进入视口
    observerInstance?.trigger(true, 1);
    await nextTick();
    expect(inViewport.value).toBe(true);

    // 离开视口
    observerInstance?.trigger(false, 0);
    await nextTick();
    expect(inViewport.value).toBe(false);
    expect(ratio.value).toBe(0);
  });

  /**
   * 测试用例5: 自定义阈值
   */
  it('应该支持自定义阈值', () => {
    const div = document.createElement('div');
    useInViewport(div, { threshold: 0.5 });

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
      }),
    );
  });

  /**
   * 测试用例6: 自定义 rootMargin
   */
  it('应该支持自定义 rootMargin', () => {
    const div = document.createElement('div');
    useInViewport(div, { rootMargin: '100px' });

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        rootMargin: '100px',
      }),
    );
  });

  /**
   * 测试用例7: Vue Ref 支持
   */
  it('应该支持 Vue Ref', async () => {
    const divRef = ref<HTMLDivElement>();
    const { inViewport } = useInViewport(divRef);

    // 初始没有元素
    expect(inViewport.value).toBe(false);

    // 设置元素
    divRef.value = document.createElement('div');
    await nextTick();

    // 模拟进入视口
    observerInstance?.trigger(true, 1);
    await nextTick();

    expect(inViewport.value).toBe(true);
  });

  /**
   * 测试用例8: 部分可见（ratio）
   */
  it('应该正确报告可见比率', async () => {
    const div = document.createElement('div');
    const { ratio } = useInViewport(div);

    // 50% 可见
    observerInstance?.trigger(true, 0.5);
    await nextTick();
    expect(ratio.value).toBe(0.5);

    // 75% 可见
    observerInstance?.trigger(true, 0.75);
    await nextTick();
    expect(ratio.value).toBe(0.75);

    // 100% 可见
    observerInstance?.trigger(true, 1);
    await nextTick();
    expect(ratio.value).toBe(1);
  });

  /**
   * 测试用例9: 观察器清理
   */
  it('应该在清理时断开观察器', () => {
    const div = document.createElement('div');
    useInViewport(div);

    expect(observerInstance?.elements.size).toBe(1);

    // 模拟清理
    observerInstance?.disconnect();
    expect(observerInstance?.elements.size).toBe(0);
  });

  /**
   * 测试用例10: 无效元素处理
   */
  it('应该处理无效元素', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { inViewport } = useInViewport(null as any);
    expect(inViewport.value).toBe(false);
  });
});
