import { expect, it, vi, beforeEach, afterEach, describe } from 'vitest';
import { ref } from 'vue';
import useFavicon from '..';

// 模拟 DOM API
const mockQuerySelector = vi.fn();
const mockCreateElement = vi.fn();
const mockGetElementsByTagName = vi.fn();
const mockAppendChild = vi.fn();

describe('useFavicon', () => {
  beforeEach(() => {
    // 每次测试前重置模拟函数
    mockQuerySelector.mockReset();
    mockCreateElement.mockReset();
    mockGetElementsByTagName.mockReset();
    mockAppendChild.mockReset();

    // 模拟 document API
    global.document.querySelector = mockQuerySelector;
    global.document.createElement = mockCreateElement;
    global.document.getElementsByTagName = mockGetElementsByTagName;

    // 模拟 head 元素和 appendChild 方法
    const mockHead = { appendChild: mockAppendChild };
    mockGetElementsByTagName.mockReturnValue([mockHead]);
  });

  afterEach(() => {
    // 清理模拟
    vi.restoreAllMocks();
  });

  it('当未找到现有的 favicon 时应该创建新的 link 元素', () => {
    // 模拟没有找到现有的 favicon link
    mockQuerySelector.mockReturnValue(null);

    // 模拟创建新的 link 元素
    const mockLink = {
      type: '',
      href: '',
      rel: '',
    };
    mockCreateElement.mockReturnValue(mockLink);

    const faviconUrl = 'https://example.com/favicon.ico';
    useFavicon(faviconUrl);

    // 验证是否创建了新的 link 元素
    expect(mockCreateElement).toHaveBeenCalledWith('link');

    // 验证 link 元素的属性
    expect(mockLink?.type).toBe('image/x-icon');
    expect(mockLink?.href).toBe(faviconUrl);
    expect(mockLink?.rel).toBe('shortcut icon');

    // 验证 link 元素是否被添加到 head 中
    expect(mockAppendChild).toHaveBeenCalledWith(mockLink);
  });

  it('当找到现有的 favicon 时应该更新现有 link 元素', () => {
    // 模拟找到了现有的 favicon link
    const existingLink = {
      type: 'image/x-icon',
      href: 'https://example.com/favicon.ico',
      rel: 'shortcut icon',
    };
    mockQuerySelector.mockReturnValue(existingLink);

    const faviconUrl = 'https://example.com/favicon.png';
    useFavicon(faviconUrl);

    // 验证是否使用了现有的 link 元素
    expect(mockCreateElement).not.toHaveBeenCalled();

    // 验证现有 link 元素的属性是否被更新
    expect(existingLink.type).toBe('image/png');
    expect(existingLink.href).toBe(faviconUrl);
    expect(existingLink.rel).toBe('shortcut icon');

    // 验证现有 link 元素是否被添加到 head 中
    expect(mockAppendChild).toHaveBeenCalledWith(existingLink);
  });

  it('应该正确处理不同的图片类型', () => {
    mockQuerySelector.mockReturnValue(null);
    const mockLink = {
      type: 'image/svg+xml',
      href: '',
      rel: '',
    };
    mockCreateElement.mockReturnValue(mockLink);

    // 测试 SVG 类型
    useFavicon('https://example.com/favicon.svg');
    expect(mockLink.type).toBe('image/svg+xml');

    // 测试 GIF 类型
    useFavicon('https://example.com/favicon.gif');
    expect(mockLink.type).toBe('image/gif');

    // 测试 PNG 类型
    useFavicon('https://example.com/favicon.png');
    expect(mockLink.type).toBe('image/png');

    // 测试 ICO 类型
    useFavicon('https://example.com/favicon.ico');
    expect(mockLink.type).toBe('image/x-icon');
  });

  it('应该能与 ref 值一起使用', () => {
    mockQuerySelector.mockReturnValue(null);
    const mockLink = {
      rel: 'icon',
      type: '',
      href: '',
    };
    mockCreateElement.mockReturnValue(mockLink);

    const faviconRef = ref('https://example.com/favicon.svg');
    useFavicon(faviconRef);

    expect(mockLink.type).toBe('image/svg+xml');
    expect(mockLink.href).toBe('https://example.com/favicon.svg');

    // 更新 ref 值
    faviconRef.value = 'https://example.com/favicon.png';
    // 触发 watchEffect
    useFavicon(faviconRef);

    expect(mockLink.type).toBe('image/png');
    expect(mockLink.href).toBe('https://example.com/favicon.png');
  });

  it('当 href 为空时不应执行任何操作', () => {
    useFavicon('');
    useFavicon(undefined);

    // 确保没有创建元素或修改 DOM
    expect(mockCreateElement).not.toHaveBeenCalled();
    expect(mockQuerySelector).not.toHaveBeenCalled();
  });
});
