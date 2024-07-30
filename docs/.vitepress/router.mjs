const Router = {
  // Request: ['useRequest', 'useAxios'],
  Dom: [
    'useEventListener',
    'useWindowSize',
    // 'useSize',
    'useRect',
    // 'useKeyPress',
    // 'useFullscreen',
    // 'useDocumentVisibility',
    // 'useHover',
    // 'useInViewport',
  ],
  State: [
    // 'useUrlState',
    'useToggle',
    'useBoolean',
    // 'useLocalStorageState',
    // 'useLocalforage',
    // 'useThrottle',
    // 'useDebounce',
  ],
  // Data: ['useTable'],
  Worker: ['useCountDown'],
  // 'useWorkerFunction'
};

function getRouterConfig(langPrefix = '/') {
  return [
    {
      text: '介绍',
      link: `${langPrefix}introduce`,
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