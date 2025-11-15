/**
 * @file useWebSocket 组合函数的单元测试
 * @description 测试WebSocket hook的各种使用场景和边界情况
 */

import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import useWebSocket from '..';

describe('useWebSocket', () => {
  /**
   * 测试用例1: 基本功能验证
   */
  it('应该正确导出', () => {
    expect(useWebSocket).toBeDefined();
    expect(typeof useWebSocket).toBe('function');
  });

  /**
   * 测试用例2: 参数验证
   */
  it('应该验证socketUrl参数', () => {
    expect(() => useWebSocket('')).toThrow('useWebSocket requires a string socketUrl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => useWebSocket(null as any)).toThrow('useWebSocket requires a string socketUrl');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => useWebSocket(undefined as any)).toThrow('useWebSocket requires a string socketUrl');
  });

  /**
   * 测试用例3: 初始状态
   */
  it('应该返回正确的初始状态', () => {
    const { readyState, latestMessage, webSocketIns, sendMessage, connect, disconnect } = useWebSocket(
      'wss://echo.websocket.org',
      { manual: true },
    );

    expect(readyState.value).toBe(3); // ReadyState.Closed
    expect(latestMessage.value).toBeUndefined();
    expect(webSocketIns.value).toBeUndefined();
    expect(typeof sendMessage).toBe('function');
    expect(typeof connect).toBe('function');
    expect(typeof disconnect).toBe('function');
  });

  /**
   * 测试用例4: 手动模式不自动连接
   */
  it('manual=true时不应自动连接', async () => {
    const onOpen = vi.fn();
    const { readyState, webSocketIns } = useWebSocket('wss://echo.websocket.org', {
      manual: true,
      onOpen,
    });

    await nextTick();
    expect(readyState.value).toBe(3); // Closed
    expect(webSocketIns.value).toBeUndefined();
    expect(onOpen).not.toHaveBeenCalled();
  });

  /**
   * 测试用例5: 发送消息前的验证
   */
  it('未连接时发送消息应返回false', () => {
    const { sendMessage } = useWebSocket('wss://echo.websocket.org', { manual: true });

    expect(sendMessage('test')).toBe(false);
    expect(sendMessage('')).toBe(false);
  });

  /**
   * 测试用例6: 断开连接
   */
  it('disconnect应能正确断开连接', async () => {
    const onClose = vi.fn();
    const { connect, disconnect, readyState } = useWebSocket('wss://echo.websocket.org', {
      manual: true,
      onClose,
    });

    connect();
    await nextTick();
    expect(readyState.value).toBe(0); // Connecting

    disconnect();
    await nextTick();
    // 断开后状态应该是Closing或Closed
    expect([2, 3]).toContain(readyState.value);
  });

  /**
   * 测试用例7: 默认配置合并
   */
  it('应该正确合并默认配置', () => {
    const { readyState } = useWebSocket('wss://echo.websocket.org', {
      manual: true,
      reconnectLimit: 5,
    });

    expect(readyState.value).toBe(3);
  });

  /**
   * 测试用例8: 重复连接防护
   */
  it('已连接时不应重复连接', async () => {
    const { connect, readyState } = useWebSocket('wss://echo.websocket.org', { manual: true });

    connect();
    const firstState = readyState.value;
    connect(); // 重复调用
    expect(readyState.value).toBe(firstState);
  });
});

/**
 * 集成测试组：使用真实WebSocket服务
 * 这些测试需要网络连接，可能会比较慢
 */
describe('useWebSocket - 集成测试 (真实连接)', () => {
  // 使用公开的WebSocket echo服务
  const ECHO_SERVER = 'wss://ws.ifelse.io';
  const TIMEOUT = 10000; // 10秒超时

  /**
   * 测试用例9: 真实连接建立
   */
  it(
    '应该能成功连接到真实WebSocket服务',
    async () => {
      return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('连接超时')), TIMEOUT);

        const { disconnect } = useWebSocket(ECHO_SERVER, {
          onOpen: (event) => {
            clearTimeout(timer);
            expect(event).toBeDefined();
            disconnect();
            resolve();
          },
          onError: (error) => {
            clearTimeout(timer);
            disconnect();
            reject(error);
          },
        });
      });
    },
    TIMEOUT,
  );

  /**
   * 测试用例10: 消息发送与接收
   */
  it(
    '应该能发送和接收消息',
    async () => {
      return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('消息收发超时')), TIMEOUT);
        const testMessage = 'Hello WebSocket!';
        let isConnected = false;

        const { sendMessage, disconnect, latestMessage } = useWebSocket(ECHO_SERVER, {
          onOpen: () => {
            isConnected = true;
            const success = sendMessage(testMessage);
            expect(success).toBe(true);
          },
          onMessage: (event) => {
            if (isConnected) {
              clearTimeout(timer);
              expect(event.data).toBeDefined();
              expect(latestMessage.value).toBe(event);
              disconnect();
              resolve();
            }
          },
          onError: (error) => {
            clearTimeout(timer);
            disconnect();
            reject(error);
          },
        });
      });
    },
    TIMEOUT,
  );

  /**
   * 测试用例11: 手动连接与断开
   */
  it(
    '手动模式应能正确连接和断开',
    async () => {
      return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('手动连接超时')), TIMEOUT);
        let openCount = 0;

        const { connect, disconnect, readyState } = useWebSocket(ECHO_SERVER, {
          manual: true,
          onOpen: () => {
            openCount++;
            expect(openCount).toBe(1);
            // 连接成功后立即断开
            setTimeout(() => {
              disconnect();
              // disconnect会移除监听器，所以onClose不会触发
              // 直接检查readyState变化
              setTimeout(() => {
                clearTimeout(timer);
                expect(openCount).toBe(1);
                expect([2, 3]).toContain(readyState.value); // Closing或Closed
                resolve();
              }, 100);
            }, 100);
          },
          onError: (error) => {
            clearTimeout(timer);
            disconnect();
            reject(error);
          },
        });

        // 手动触发连接
        connect();
      });
    },
    TIMEOUT,
  );

  /**
   * 测试用例12: 心跳功能
   */
  it(
    '应该能发送心跳消息',
    async () => {
      return new Promise<void>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('心跳测试超时')), TIMEOUT);
        let messageCount = 0;

        const { disconnect } = useWebSocket(ECHO_SERVER, {
          heartbeat: true,
          heartbeatInterval: 1000, // 1秒发送一次心跳
          heartbeatMessage: 'ping',
          onOpen: () => {
            // 等待至少一次心跳
          },
          onMessage: () => {
            messageCount++;
            // 收到至少一条消息（心跳响应）后测试通过
            if (messageCount >= 1) {
              clearTimeout(timer);
              disconnect();
              resolve();
            }
          },
          onError: (error) => {
            clearTimeout(timer);
            disconnect();
            reject(error);
          },
        });
      });
    },
    TIMEOUT,
  );
});
