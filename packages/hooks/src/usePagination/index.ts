import { ref, computed, Ref, ComputedRef } from 'vue';

/**
 * 分页参数
 */
export interface PaginationParams {
  /**
   * 当前页码
   */
  current: number;

  /**
   * 每页条数
   */
  pageSize: number;

  /**
   * 总条数
   */
  total?: number;

  /**
   * 其他查询参数
   */
  [key: string]: any;
}

/**
 * 分页配置选项
 */
export interface UsePaginationOptions {
  /**
   * 默认当前页
   * @default 1
   */
  defaultCurrent?: number;

  /**
   * 默认每页条数
   * @default 10
   */
  defaultPageSize?: number;

  /**
   * 每页条数选项
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * 总条数
   */
  total?: number;
}

/**
 * 分页返回结果
 */
export interface UsePaginationResult {
  /**
   * 当前页码（响应式）
   */
  current: Ref<number>;

  /**
   * 每页条数（响应式）
   */
  pageSize: Ref<number>;

  /**
   * 总条数（响应式）
   */
  total: Ref<number>;

  /**
   * 总页数（计算属性）
   */
  totalPage: ComputedRef<number>;

  /**
   * 是否是第一页
   */
  isFirstPage: ComputedRef<boolean>;

  /**
   * 是否是最后一页
   */
  isLastPage: ComputedRef<boolean>;

  /**
   * 跳转到指定页
   */
  changeCurrent: (page: number) => void;

  /**
   * 修改每页条数
   */
  changePageSize: (size: number) => void;

  /**
   * 设置总条数
   */
  setTotal: (total: number) => void;

  /**
   * 上一页
   */
  prev: () => void;

  /**
   * 下一页
   */
  next: () => void;

  /**
   * 跳转到第一页
   */
  first: () => void;

  /**
   * 跳转到最后一页
   */
  last: () => void;

  /**
   * 重置分页
   */
  reset: () => void;

  /**
   * 获取分页参数
   */
  getPaginationParams: () => PaginationParams;
}

/**
 * usePagination - 分页管理
 * @param options 配置选项
 * @returns 分页状态和方法
 */
function usePagination(options: UsePaginationOptions = {}): UsePaginationResult {
  const { defaultCurrent = 1, defaultPageSize = 10, pageSizeOptions = [10, 20, 50, 100], total: initialTotal = 0 } = options;

  // 响应式状态
  const current = ref(defaultCurrent);
  const pageSize = ref(defaultPageSize);
  const total = ref(initialTotal);

  // 计算总页数
  const totalPage = computed(() => {
    return Math.ceil(total.value / pageSize.value) || 1;
  });

  // 是否是第一页
  const isFirstPage = computed(() => {
    return current.value <= 1;
  });

  // 是否是最后一页
  const isLastPage = computed(() => {
    return current.value >= totalPage.value;
  });

  /**
   * 跳转到指定页
   */
  const changeCurrent = (page: number) => {
    const targetPage = Math.max(1, Math.min(page, totalPage.value));
    current.value = targetPage;
  };

  /**
   * 修改每页条数
   */
  const changePageSize = (size: number) => {
    if (!pageSizeOptions.includes(size)) {
      console.warn(`pageSize ${size} is not in pageSizeOptions`);
    }
    pageSize.value = size;
    // 重新计算当前页，确保不超出范围
    const newTotalPage = Math.ceil(total.value / size) || 1;
    if (current.value > newTotalPage) {
      current.value = newTotalPage;
    }
  };

  /**
   * 设置总条数
   */
  const setTotal = (newTotal: number) => {
    total.value = newTotal;
    // 确保当前页不超出范围
    if (current.value > totalPage.value) {
      current.value = totalPage.value;
    }
  };

  /**
   * 上一页
   */
  const prev = () => {
    if (!isFirstPage.value) {
      current.value--;
    }
  };

  /**
   * 下一页
   */
  const next = () => {
    if (!isLastPage.value) {
      current.value++;
    }
  };

  /**
   * 跳转到第一页
   */
  const first = () => {
    current.value = 1;
  };

  /**
   * 跳转到最后一页
   */
  const last = () => {
    current.value = totalPage.value;
  };

  /**
   * 重置分页
   */
  const reset = () => {
    current.value = defaultCurrent;
    pageSize.value = defaultPageSize;
  };

  /**
   * 获取分页参数
   */
  const getPaginationParams = (): PaginationParams => {
    return {
      current: current.value,
      pageSize: pageSize.value,
      total: total.value,
    };
  };

  return {
    current,
    pageSize,
    total,
    totalPage,
    isFirstPage,
    isLastPage,
    changeCurrent,
    changePageSize,
    setTotal,
    prev,
    next,
    first,
    last,
    reset,
    getPaginationParams,
  };
}

export default usePagination;
