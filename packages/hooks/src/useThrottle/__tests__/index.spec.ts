// 这是一个测试文件,用于测试 useThrottle hook 的功能

import { vi, expect, it } from 'vitest'; // 导入测试工具
import { ref } from 'vue'; // 导入 Vue 的 ref
import useThrottle from '../index';

// 测试用例1: 测试初始值是否能立即返回
it('测试初始值是否能立即返回', () => {
  const value = ref('initial'); // 创建一个初始值为 'initial' 的响应式引用
  const throttledValue = useThrottle(value); // 使用节流hook处理这个值

  expect(throttledValue.value).toBe('initial'); // 验证节流后的值是否等于初始值
});

// 测试用例2: 测试延迟后的值是否正确更新
it('测试延迟后的值是否正确更新', () => {
  vi.useFakeTimers(); // 使用虚拟定时器
  const value = ref('initial');
  const delay = 1000; // 设置1秒的延迟
  const throttledValue = useThrottle(value, delay);

  throttledValue.value = 'updated'; // 更新值
  vi.advanceTimersByTime(delay); // 推进时间

  expect(throttledValue.value).toBe('updated'); // 验证延迟后的值是否更新
});

// 测试用例3: 测试不提供延迟时是否使用默认延迟值
it('测试不提供延迟时是否使用默认延迟值', async () => {
  vi.useFakeTimers();
  const value = ref('initial');
  const throttledValue = await useThrottle(value);

  throttledValue.value = 'updated';
  await vi.advanceTimersByTime(1000); // 使用默认延迟时间1000ms

  expect(throttledValue.value).toBe('updated'); // 验证使用默认延迟后的值是否更新
});
