import { vi, expect, it } from 'vitest';
import { ref } from 'vue';
import useDebounce from '../index';

it('should return the initial value immediately', () => {
  const value = ref('initial');
  const throttledValue = useDebounce(value);

  expect(throttledValue.value).toBe('initial');
});

it('should update the value after the delay', () => {
  vi.useFakeTimers();
  const value = ref('initial');
  const delay = 1000;
  const throttledValue = useDebounce(value, delay);

  throttledValue.value = 'updated';
  vi.advanceTimersByTime(delay);

  expect(throttledValue.value).toBe('updated');
});

it('should use the default delay if no delay is provided', async () => {
  vi.useFakeTimers();
  const value = ref('initial');
  const throttledValue = await useDebounce(value);

  throttledValue.value = 'updated';
  await vi.advanceTimersByTime(1000); // default delay

  expect(throttledValue.value).toBe('updated');
});
