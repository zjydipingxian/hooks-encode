import { describe, expect, it } from 'vitest';
import { ref } from 'vue';
import useOmit from '..';

describe('useOmit', () => {
  it('测试基本功能：传入普通对象和要排除的键数组', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };

    const result = useOmit(user, ['id', 'email']);

    expect(result).toEqual({
      name: 'John Doe',
      age: 30,
    });
    expect(result).not.toHaveProperty('id');
    expect(result).not.toHaveProperty('email');
  });

  it('测试字符串形式的键列表', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };

    const result = useOmit(user, 'id,email');

    expect(result).toEqual({
      name: 'John Doe',
      age: 30,
    });
  });

  it('测试传入Vue Ref对象', () => {
    const userRef = ref({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    });

    const result = useOmit(userRef, ['id', 'email']);

    expect(result).toEqual({
      name: 'John Doe',
      age: 30,
    });
  });

  it('测试边界情况：空键列表', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    };

    const result1 = useOmit(user, []);
    const result2 = useOmit(user, '');

    expect(result1).toEqual(user);
    expect(result2).toEqual(user);
  });

  it('测试带有空格的字符串键列表', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
    };

    const result = useOmit(user, 'id, email, age');

    expect(result).toEqual({
      name: 'John Doe',
    });
  });
});
