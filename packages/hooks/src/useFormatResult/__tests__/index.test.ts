import { expect, it } from 'vitest';
import { ref } from 'vue';

import useFormatResult from '..';

it('应该正确格式化普通数据', () => {
  const data = 'hello';
  const formatFn = (str: string) => str.toUpperCase();

  const result = useFormatResult(data, formatFn);

  expect(result.value).toBe('HELLO');
});

it('应该正确格式化响应式数据', () => {
  const data = ref('hello');
  const formatFn = (str: string) => str.toUpperCase();

  const result = useFormatResult(data, formatFn);

  expect(result.value).toBe('HELLO');

  data.value = 'world';
  expect(result.value).toBe('WORLD');
});

it('应该处理数字数据', () => {
  const data = 100;
  const formatFn = (num: number) => `$${num}`;

  const result = useFormatResult(data, formatFn);

  expect(result.value).toBe('$100');
});

it('应该处理对象数据', () => {
  const data = { name: 'John', age: 30 };
  const formatFn = (obj: { name: string; age: number }) => `${obj.name} is ${obj.age} years old`;

  const result = useFormatResult(data, formatFn);

  expect(result.value).toBe('John is 30 years old');
});
