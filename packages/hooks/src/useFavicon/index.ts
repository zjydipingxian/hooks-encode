import { watchEffect, computed, Ref, unref } from 'vue';

// ico 图标类型
const UseFaviconImgTypeMap = {
  SVG: 'image/svg+xml',
  ICO: 'image/x-icon',
  GIF: 'image/gif',
  PNG: 'image/png',
};

// ico 图标类型
type UseFaviconImgTypes = keyof typeof UseFaviconImgTypeMap;

/**
 * 用于设置网站图标的 Hook
 * @param href - 图标的URL地址，支持string类型或ref包装的string
 */
function useFavicon(href?: string | Ref<string | undefined>) {
  // 将输入的href转换为计算属性
  const _href = computed(() => unref(href));

  // 监听href变化并更新favicon
  watchEffect(() => {
    // 如果href为空则不执行
    if (!_href.value) return;

    // 解析图片URL获取文件后缀
    const cutUrl = _href.value?.split('.');
    const imgSuffix = cutUrl[cutUrl.length - 1].toLocaleUpperCase() as UseFaviconImgTypes;

    // 获取已存在的favicon链接元素，如果不存在则创建新的
    const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');

    // 设置link标签的属性
    link.type = UseFaviconImgTypeMap[imgSuffix];
    link.href = _href.value;
    link.rel = 'shortcut icon';

    // 将link标签添加到文档头部
    document.getElementsByTagName('head')[0].appendChild(link);
  });
}
export default useFavicon;
