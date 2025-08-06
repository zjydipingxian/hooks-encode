import { expect, it } from 'vitest';
import { ref } from 'vue';

import useRect from '../index';

// 测试用例1: 测试 window 对象的尺寸
it('测试 window 对象的尺寸', () => {
  const rect = useRect(window);
  expect(rect.width).toEqual(window.innerWidth); // 检查宽度是否等于窗口内部宽度
  expect(rect.height).toEqual(window.innerHeight); // 检查高度是否等于窗口内部高度
});

// 测试用例2: 测试 DOM 元素的尺寸
it('测试 window 对象的尺寸', () => {
  const element = document.createElement('div'); // 创建一个 div 元素
  const rect = useRect(element);
  expect(rect.width).toEqual(element.getBoundingClientRect().width); // 检查宽度是否与元素实际宽度相符
  expect(rect.height).toEqual(element.getBoundingClientRect().height); // 检查高度是否与元素实际高度相符
});

// 测试用例3: 测试未定义元素的默认尺寸
it('测试未定义元素的默认尺寸', () => {
  const rect = useRect(ref(undefined)); // 传入一个值为 undefined 的 ref
  expect(rect.width).toEqual(0); // 检查宽度是否为默认值 0
  expect(rect.height).toEqual(0); // 检查高度是否为默认值 0
});
