import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useThrottleFn from '../index'



describe('useThrottleFn', () => {
  // 在每个测试前启用假定时器
  beforeEach(() => {
    vi.useFakeTimers()
  })

  // 在每个测试后恢复真实定时器并清理所有模拟
  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  

  /**
   * 测试基本功能 - 返回包含 run 属性的对象
   */
  it('should return an object with run property', () => {
    const mockFn = vi.fn()
    const result = useThrottleFn(mockFn)
    
    expect(result).toHaveProperty('run')
    expect(typeof result.run).toBe('function')
  })

  

  /**
   * 测试边界情况：节流时间为0
   * 当节流时间为0时，应该每次调用都执行
   */
  it('should call function immediately when delay is 0', () => {
    const mockFn = vi.fn()
    const { run: throttledFn } = useThrottleFn(mockFn, 0)
    
    throttledFn()
    throttledFn()
    throttledFn()
    
    expect(mockFn).toHaveBeenCalledTimes(3)
  })

  /**
   * 测试边界情况：负数节流时间
   * 负数应该被视为0，立即执行
   */
  it('should treat negative delay as 0', () => {
    const mockFn = vi.fn()
    const { run: throttledFn } = useThrottleFn(mockFn, -100)
    
    throttledFn()
    throttledFn()
    
    expect(mockFn).toHaveBeenCalledTimes(2)
  })

 

  /**
   * 测试基本功能 - 返回包含 run 属性的对象
   */
  it('should return an object with run property', () => {
    const mockFn = vi.fn()
    const result = useThrottleFn(mockFn)
    
    expect(result).toHaveProperty('run')
    expect(typeof result.run).toBe('function')
  })
  

  /**
   * 测试自定义延迟时间
   * 当提供 delay 参数时，应使用提供的值
   */
  it('should use provided delay when specified', () => {
    const mockFn = vi.fn()
    const customDelay = 500
    const { run } = useThrottleFn(mockFn, customDelay)

    vi.advanceTimersByTime(customDelay)

    run()
    expect(mockFn).toHaveBeenCalledTimes(1)
    
  })
  

     /**
   * 测试多次快速调用只执行一次
   * 在节流时间内快速连续调用多次，只应该执行一次
   */
  it('should execute only once for multiple rapid calls', () => {
    const mockFn = vi.fn()
    const delay = 500
    const { run: throttledFn } = useThrottleFn(mockFn, delay)
    
    // 快速连续调用5次
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    throttledFn()
    
    expect(mockFn).toHaveBeenCalledTimes(0)
    
    // 等待节流时间过后再次调用
    vi.advanceTimersByTime(delay)
    throttledFn()
    expect(mockFn).toHaveBeenCalledTimes(1)
  })


  
})
    