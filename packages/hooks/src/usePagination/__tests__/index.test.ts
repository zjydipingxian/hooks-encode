/**
 * @file usePagination 组合函数的单元测试
 * @description 测试分页管理 hook 的各种使用场景
 */

import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import usePagination from '..';

describe('usePagination', () => {
  /**
   * 测试用例1: 基本功能验证
   */
  it('应该正确导出', () => {
    expect(usePagination).toBeDefined();
    expect(typeof usePagination).toBe('function');
  });

  /**
   * 测试用例2: 默认值
   */
  it('应该使用默认值', () => {
    const { current, pageSize, total, totalPage } = usePagination();

    expect(current.value).toBe(1);
    expect(pageSize.value).toBe(10);
    expect(total.value).toBe(0);
    expect(totalPage.value).toBe(1);
  });

  /**
   * 测试用例3: 自定义初始值
   */
  it('应该支持自定义初始值', () => {
    const { current, pageSize, total } = usePagination({
      defaultCurrent: 2,
      defaultPageSize: 20,
      total: 100,
    });

    expect(current.value).toBe(2);
    expect(pageSize.value).toBe(20);
    expect(total.value).toBe(100);
  });

  /**
   * 测试用例4: 计算总页数
   */
  it('应该正确计算总页数', () => {
    const { totalPage } = usePagination({
      defaultPageSize: 10,
      total: 95,
    });

    expect(totalPage.value).toBe(10); // Math.ceil(95 / 10) = 10
  });

  /**
   * 测试用例5: 切换页码
   */
  it('应该能够切换页码', async () => {
    const { current, changeCurrent } = usePagination({
      total: 100,
    });

    expect(current.value).toBe(1);

    changeCurrent(3);
    await nextTick();
    expect(current.value).toBe(3);
  });

  /**
   * 测试用例6: 页码边界处理
   */
  it('应该处理页码边界', async () => {
    const { current, totalPage, changeCurrent } = usePagination({
      defaultPageSize: 10,
      total: 50,
    });

    // 尝试跳转到超出范围的页码
    changeCurrent(999);
    await nextTick();
    expect(current.value).toBe(totalPage.value); // 应该限制在最大页数

    changeCurrent(-1);
    await nextTick();
    expect(current.value).toBe(1); // 应该限制在最小页数
  });

  /**
   * 测试用例7: 修改每页条数
   */
  it('应该能够修改每页条数', async () => {
    const { pageSize, changePageSize } = usePagination({
      defaultPageSize: 10,
    });

    expect(pageSize.value).toBe(10);

    changePageSize(20);
    await nextTick();
    expect(pageSize.value).toBe(20);
  });

  /**
   * 测试用例8: 修改每页条数时调整当前页
   */
  it('修改每页条数时应该调整当前页', async () => {
    const { current, pageSize, changePageSize, changeCurrent } = usePagination({
      defaultPageSize: 10,
      total: 100,
    });

    // 跳转到第 10 页
    changeCurrent(10);
    await nextTick();
    expect(current.value).toBe(10);

    // 修改每页条数为 50（总页数变为 2）
    changePageSize(50);
    await nextTick();
    expect(pageSize.value).toBe(50);
    expect(current.value).toBe(2); // 当前页应该调整为最大页数
  });

  /**
   * 测试用例9: 设置总数
   */
  it('应该能够设置总数', async () => {
    const { total, setTotal } = usePagination();

    expect(total.value).toBe(0);

    setTotal(200);
    await nextTick();
    expect(total.value).toBe(200);
  });

  /**
   * 测试用例10: 上一页/下一页
   */
  it('应该能够上一页/下一页', async () => {
    const { current, prev, next } = usePagination({
      defaultCurrent: 5,
      total: 100,
    });

    expect(current.value).toBe(5);

    prev();
    await nextTick();
    expect(current.value).toBe(4);

    next();
    await nextTick();
    expect(current.value).toBe(5);
  });

  /**
   * 测试用例11: 第一页/最后一页状态
   */
  it('应该正确判断第一页和最后一页', async () => {
    const { current, isFirstPage, isLastPage, changeCurrent, totalPage } = usePagination({
      defaultPageSize: 10,
      total: 50,
    });

    expect(current.value).toBe(1);
    expect(isFirstPage.value).toBe(true);
    expect(isLastPage.value).toBe(false);

    changeCurrent(totalPage.value);
    await nextTick();
    expect(isFirstPage.value).toBe(false);
    expect(isLastPage.value).toBe(true);
  });

  /**
   * 测试用例12: 首页/尾页跳转
   */
  it('应该能够跳转到首页和尾页', async () => {
    const { current, totalPage, first, last } = usePagination({
      defaultCurrent: 3,
      defaultPageSize: 10,
      total: 100,
    });

    expect(current.value).toBe(3);

    last();
    await nextTick();
    expect(current.value).toBe(totalPage.value);

    first();
    await nextTick();
    expect(current.value).toBe(1);
  });

  /**
   * 测试用例13: 重置分页
   */
  it('应该能够重置分页', async () => {
    const { current, pageSize, changeCurrent, changePageSize, reset } = usePagination({
      defaultCurrent: 1,
      defaultPageSize: 10,
      total: 100,
    });

    changeCurrent(5);
    changePageSize(20);
    await nextTick();
    expect(current.value).toBe(5);
    expect(pageSize.value).toBe(20);

    reset();
    await nextTick();
    expect(current.value).toBe(1);
    expect(pageSize.value).toBe(10);
  });

  /**
   * 测试用例14: 获取分页参数
   */
  it('应该能够获取分页参数', () => {
    const { getPaginationParams } = usePagination({
      defaultCurrent: 2,
      defaultPageSize: 20,
      total: 100,
    });

    const params = getPaginationParams();
    expect(params).toEqual({
      current: 2,
      pageSize: 20,
      total: 100,
    });
  });

  /**
   * 测试用例15: 边界处理 - 上一页在第一页
   */
  it('在第一页时上一页不应该生效', async () => {
    const { current, prev } = usePagination({
      total: 100,
    });

    expect(current.value).toBe(1);

    prev();
    await nextTick();
    expect(current.value).toBe(1); // 仍然是第一页
  });

  /**
   * 测试用例16: 边界处理 - 下一页在最后一页
   */
  it('在最后一页时下一页不应该生效', async () => {
    const { current, totalPage, next, changeCurrent } = usePagination({
      defaultPageSize: 10,
      total: 50,
    });

    changeCurrent(totalPage.value);
    await nextTick();
    const lastPage = current.value;

    next();
    await nextTick();
    expect(current.value).toBe(lastPage); // 仍然是最后一页
  });

  /**
   * 测试用例17: 总数为0时的总页数
   */
  it('总数为0时总页数应该是1', () => {
    const { totalPage } = usePagination({
      total: 0,
    });

    expect(totalPage.value).toBe(1);
  });

  /**
   * 测试用例18: 设置总数后调整当前页
   */
  it('设置总数后应该调整当前页', async () => {
    const { current, changeCurrent, setTotal } = usePagination({
      defaultPageSize: 10,
      total: 100,
    });

    changeCurrent(10);
    await nextTick();
    expect(current.value).toBe(10);

    // 设置总数为 50（总页数变为 5）
    setTotal(50);
    await nextTick();
    expect(current.value).toBe(5); // 当前页应该调整为最大页数
  });
});
