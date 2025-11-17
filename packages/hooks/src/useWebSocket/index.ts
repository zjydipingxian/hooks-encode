import { ref, Ref, onUnmounted } from 'vue';
import { isBrowser } from '../utils';

interface UseWebSocketOptions {
  manual?: boolean; // 是否手动触发连接，默认自动连接
  reconnectLimit?: number; // 最大重连次数
  reconnectInterval?: number; // 重连间隔时间(ms)
  heartbeat?: boolean; // 是否启用心跳检测
  heartbeatInterval?: number; // 心跳间隔时间(ms)
  heartbeatMessage?: string; // 心跳消息内容
  onOpen?: (event: WebSocketEventMap['open']) => void; // 连接打开回调
  onClose?: (event: WebSocketEventMap['close']) => void; // 连接关闭回调
  onMessage?: (event: WebSocketEventMap['message']) => void; // 接收消息回调
  onError?: (event: WebSocketEventMap['error']) => void; // 错误回调
}

/**
 * WebSocket 连接状态枚举（与原生 WebSocket.readyState 保持一致）
 */

export enum ReadyState {
  // eslint-disable-next-line no-unused-vars
  Connecting = 0, // 连接中
  // eslint-disable-next-line no-unused-vars
  Open = 1, // 连接已打开
  // eslint-disable-next-line no-unused-vars
  Closing = 2, // 连接关闭中
  // eslint-disable-next-line no-unused-vars
  Closed = 3, // 连接已关闭
}

/**
 * 工具函数返回结果接口
 */
interface Result {
  latestMessage: Ref<WebSocketEventMap['message'] | undefined>; // 最新消息
  sendMessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => boolean; // 发送消息方法
  disconnect: () => void; // 断开连接方法
  connect: () => void; // 建立连接方法
  readyState: Ref<ReadyState>; // 当前连接状态（直接映射原生 WebSocket.readyState）
  webSocketIns: Ref<WebSocket | undefined>; // WebSocket实例引用
}

/**
 * 默认配置选项
 */
const defaultOptions: UseWebSocketOptions = {
  manual: false,
  reconnectLimit: 3,
  reconnectInterval: 3000,
  heartbeat: true,
  heartbeatInterval: 30000, // 默认30秒一次心跳
  heartbeatMessage: 'ping',
  onOpen: () => {},
  onClose: () => {},
  onMessage: () => {},
  onError: () => {},
};

function useWebSocket(socketUrl: string, options: UseWebSocketOptions = defaultOptions): Result {
  // 合并默认配置和用户配置
  const {
    manual,
    reconnectLimit,
    reconnectInterval,
    heartbeat,
    heartbeatInterval,
    heartbeatMessage,
    onOpen,
    onClose,
    onMessage,
    onError,
  } = { ...defaultOptions, ...options };

  // 验证连接地址有效性
  if (!socketUrl || typeof socketUrl !== 'string') {
    throw new Error('useWebSocket requires a string socketUrl');
  }

  if (!isBrowser) {
    throw new Error('useWebSocket is not available in current environment');
  }

  // 响应式状态管理
  const socket = ref<WebSocket>();
  const latestMessage = ref<WebSocketEventMap['message']>();
  const reconnectCount = ref<number>(0);
  const isManualDisconnect = ref<boolean>(false); // 标记是否主动断开连接

  // 使用 ref 来存储 readyState，确保状态同步
  const readyState = ref<ReadyState>(ReadyState.Closed);

  // 定时器管理（使用通用类型）
  const timeoutRef = ref<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimer = ref<ReturnType<typeof setInterval> | null>(null);

  /**
   * 启动心跳检测
   */
  const startHeartbeat = () => {
    if (heartbeat && heartbeatInterval && heartbeatMessage) {
      stopHeartbeat(); // 先清除可能存在的旧定时器
      heartbeatTimer.value = setInterval(() => {
        sendMessage(heartbeatMessage);
      }, heartbeatInterval);
    }
  };

  /**
   * 停止心跳检测
   */
  const stopHeartbeat = () => {
    if (heartbeatTimer.value) {
      clearInterval(heartbeatTimer.value);
      heartbeatTimer.value = null;
    }
  };

  /**
   * 处理连接打开事件
   */
  const handleOpen = (event: WebSocketEventMap['open']) => {
    reconnectCount.value = 0; // 连接成功重置重连计数
    readyState.value = ReadyState.Open; // 更新 readyState
    onOpen && onOpen(event);
    startHeartbeat(); // 连接成功后启动心跳
  };

  /**
   * 处理消息接收事件
   */
  const handleMessage = (event: WebSocketEventMap['message']) => {
    latestMessage.value = event;
    onMessage && onMessage(event);
  };

  /**
   * 处理错误事件
   */
  const handleError = (event: WebSocketEventMap['error']) => {
    console.error('WebSocket error:', event);
    readyState.value = ReadyState.Closed; // 更新 readyState
    onError && onError(event);
    // 非主动断开时尝试重连
    if (!isManualDisconnect.value) {
      reconnect();
    }
  };

  /**
   * 处理连接关闭事件
   */
  const handleClose = (event: WebSocketEventMap['close']) => {
    stopHeartbeat(); // 连接关闭时停止心跳
    readyState.value = ReadyState.Closed; // 更新 readyState
    onClose && onClose(event);

    // 非主动断开 + 未超过重连次数 + 非正常关闭时重连
    if (
      !isManualDisconnect.value &&
      reconnectCount.value < (reconnectLimit || 0) &&
      event.code !== 1000 // 1000表示正常关闭
    ) {
      reconnect();
    } else {
      isManualDisconnect.value = false; // 重置主动断开标记
    }
  };

  /**
   * 清理WebSocket实例
   * 注意：不移除事件监听器，确保 close 事件能正常触发回调
   */
  const cleanWebSocket = () => {
    if (socket.value) {
      // 仅在连接未关闭时才执行 close
      const currentState = socket.value.readyState;
      if (currentState === WebSocket.CONNECTING || currentState === WebSocket.OPEN) {
        socket.value.close();
      }
    }
  };

  const run = () => {
    // 先清理旧实例
    cleanWebSocket();

    try {
      // 创建新的 WebSocket 实例
      const ws = new WebSocket(socketUrl);
      socket.value = ws;
      readyState.value = ReadyState.Connecting; // 设置初始状态为连接中

      // 绑定事件监听（只在创建新实例时绑定一次）
      ws.addEventListener('open', handleOpen);
      ws.addEventListener('message', handleMessage);
      ws.addEventListener('error', handleError);
      ws.addEventListener('close', handleClose);
    } catch (error) {
      console.error('Failed to create WebSocket instance:', error);
      readyState.value = ReadyState.Closed; // 更新 readyState
      handleError(error as WebSocketEventMap['error']);
    }
  };

  /**
   * 手动建立连接方法
   */
  const connect = () => {
    const currentState = readyState.value;
    // 已连接或正在连接时，不重复执行
    if (currentState === ReadyState.Open || currentState === ReadyState.Connecting) {
      return;
    }
    isManualDisconnect.value = false; // 重置主动断开标记
    reconnectCount.value = 0;
    run();
  };

  /**
   * 重连方法
   */
  const reconnect = () => {
    if (reconnectCount.value >= (reconnectLimit || 0)) {
      console.warn('Reconnect limit reached, stopping attempts');
      return;
    }

    // 清除上一次的超时定时器
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value);
      timeoutRef.value = null;
    }
    timeoutRef.value = setTimeout(() => {
      reconnectCount.value++;
      console.log(`Reconnecting attempt ${reconnectCount.value}/${reconnectLimit}`);
      run();
    }, reconnectInterval || 0);
  };

  /**
   * 断开连接方法
   */
  const disconnect = () => {
    const currentState = readyState.value;
    if ((currentState === ReadyState.Connecting || currentState === ReadyState.Open) && socket.value) {
      isManualDisconnect.value = true; // 标记为主动断开

      if (timeoutRef.value) {
        clearTimeout(timeoutRef.value);
        timeoutRef.value = null;
      }
      stopHeartbeat();
      cleanWebSocket();
    }
  };

  /**
   * 发送消息方法
   * @param data 要发送的数据
   * @returns 是否发送成功
   */
  const sendMessage = (data: string | ArrayBufferLike | Blob | ArrayBufferView): boolean => {
    if (data == null || data === '') {
      console.warn('Cannot send empty message');
      return false;
    }

    if (!socket.value || readyState.value !== ReadyState.Open) {
      console.warn('Cannot send message: WebSocket is not open');
      return false;
    }

    try {
      socket.value.send(data);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  // 组件卸载时清理资源
  onUnmounted(() => {
    disconnect();
    if (timeoutRef.value) {
      clearTimeout(timeoutRef.value);
      timeoutRef.value = null;
    }
    stopHeartbeat();
  });

  // 非手动模式下自动连接
  if (!manual && isBrowser) {
    connect();
  }

  return {
    latestMessage,
    sendMessage,
    disconnect,
    connect,
    readyState,
    webSocketIns: socket,
  };
}
export default useWebSocket;
