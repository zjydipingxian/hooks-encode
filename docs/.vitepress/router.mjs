const Router = {
  // Request: ['useRequest', 'useAxios'],
  Dom: [
    // 'useSize',
    // 'useKeyPress',
    // 'useFullscreen',
    // 'useDocumentVisibility',
    // 'useHover',
    // 'useInViewport',
  ],
  State: [
    // 'useUrlState',
    // 'useToggle',
    'useBoolean',
    // 'useLocalStorageState',
    // 'useLocalforage',
    // 'useThrottle',
    // 'useDebounce',
  ],
  // Data: ['useTable'],
  // Worker: ['useWorkerFunction'],
};

function getRouterConfig(langPrefix = '/') {
  return [
    {
      text: '介绍',
      link: `${langPrefix}`,
    },
    ...Object.entries(Router).map(([text, children]) => ({
      text,
      items: children.map(hookName => ({
        link: `${langPrefix}${hookName}/`,
        text: hookName,
      })),
    })),
  ];
}




export {
  getRouterConfig
}